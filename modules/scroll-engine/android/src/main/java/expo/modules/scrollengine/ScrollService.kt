package expo.modules.scrollengine

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.GestureDescription
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.graphics.Path
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.SystemClock
import android.view.WindowManager
import android.view.accessibility.AccessibilityEvent
import android.widget.Toast

class ScrollService : AccessibilityService() {
  companion object {
    @Volatile
    var instance: ScrollService? = null
      private set

    private const val MAX_RUN_MS = 60 * 60 * 1000L
    private const val IDLE_POLL_MS = 500L
    private const val INFLIGHT_POLL_MS = 40L
    private const val CALLBACK_GRACE_MS = 600L
    private const val CANCEL_BACKOFF_MS = 150L
    private const val YIELD_DELAY_MS = 1000
  }

  private val handler = Handler(Looper.getMainLooper())
  private val pumpTask = Runnable { pump() }

  @Volatile
  var running = false
    private set

  @Volatile
  private var foreground = ""

  @Volatile
  private var screenOn = true

  @Volatile
  private var preview = false

  private var inFlight = false
  private var currentGesture: GestureDescription? = null
  private var lastDispatchAt = 0L
  private var lastChunkMs = 0L
  private var retryCount = 0
  private var runStartedAt = 0L
  private var button: FloatingButton? = null
  private var screenReceiver: BroadcastReceiver? = null

  private val gestureCallback = object : GestureResultCallback() {
    override fun onCompleted(gestureDescription: GestureDescription) {
      if (gestureDescription !== currentGesture) return
      inFlight = false
      retryCount = 0
      schedule(0)
    }

    override fun onCancelled(gestureDescription: GestureDescription) {
      if (gestureDescription !== currentGesture) return
      inFlight = false
      schedule(CANCEL_BACKOFF_MS)
    }
  }

  override fun onServiceConnected() {
    super.onServiceConnected()
    instance = this
    registerScreenReceiver()
    button = FloatingButton(this).also { it.show(running) }
    EngineState.emit(this)
  }

  override fun onAccessibilityEvent(event: AccessibilityEvent?) {
    if (event?.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return
    val packageName = event.packageName?.toString().orEmpty()
    if (packageName.isEmpty()) return
    if (ScrollPolicy.tracksForeground(packageName, event.className?.toString().orEmpty(), this.packageName)) {
      foreground = packageName
    }
  }

  override fun onInterrupt() = Unit

  override fun onUnbind(intent: Intent?): Boolean {
    cleanup()
    return super.onUnbind(intent)
  }

  override fun onDestroy() {
    cleanup()
    super.onDestroy()
  }

  fun start() {
    if (running) return
    running = true
    retryCount = 0
    runStartedAt = SystemClock.elapsedRealtime()
    handler.removeCallbacks(pumpTask)
    pump()
    onStateChanged()
  }

  fun stop() {
    running = false
    handler.removeCallbacks(pumpTask)
    button?.setKeepScreenOn(false)
    onStateChanged()
  }

  fun toggle() = if (running) stop() else start()

  fun adjustSecs(delta: Int) {
    EnginePrefs.setSecs(this, EnginePrefs.secs(this) + delta)
    onStateChanged()
  }

  fun setPreview(enabled: Boolean) {
    preview = enabled
  }

  fun refreshLabels() = button?.refreshLabels()

  private fun onStateChanged() {
    button?.update(running, EnginePrefs.secs(this))
    EngineState.emit(this)
  }

  private fun cleanup() {
    running = false
    inFlight = false
    handler.removeCallbacksAndMessages(null)
    button?.remove()
    button = null
    screenReceiver?.let { runCatching { unregisterReceiver(it) } }
    screenReceiver = null
    if (instance === this) instance = null
    EngineState.emit(this)
  }

  private fun registerScreenReceiver() {
    val receiver = object : BroadcastReceiver() {
      override fun onReceive(context: Context, intent: Intent) {
        when (intent.action) {
          Intent.ACTION_SCREEN_OFF -> screenOn = false
          Intent.ACTION_SCREEN_ON, Intent.ACTION_USER_PRESENT -> screenOn = true
        }
      }
    }
    val filter = IntentFilter().apply {
      addAction(Intent.ACTION_SCREEN_OFF)
      addAction(Intent.ACTION_SCREEN_ON)
      addAction(Intent.ACTION_USER_PRESENT)
    }
    if (Build.VERSION.SDK_INT >= 33) {
      registerReceiver(receiver, filter, Context.RECEIVER_NOT_EXPORTED)
    } else {
      registerReceiver(receiver, filter)
    }
    screenReceiver = receiver
  }

  private fun schedule(delayMs: Long) {
    handler.removeCallbacks(pumpTask)
    handler.postDelayed(pumpTask, delayMs)
  }

  private fun canScrollHere() =
    ScrollPolicy.shouldScroll(foreground, packageName, EnginePrefs.allowed(this), preview)

  private fun pump() {
    if (!running) {
      inFlight = false
      return
    }
    if (SystemClock.elapsedRealtime() - runStartedAt > MAX_RUN_MS) {
      stop()
      runCatching {
        Toast.makeText(this, EnginePrefs.label(this, "autoStopped", "Stopped after 60 minutes"), Toast.LENGTH_LONG).show()
      }
      return
    }
    if (!screenOn || !canScrollHere()) {
      inFlight = false
      button?.setKeepScreenOn(false)
      schedule(IDLE_POLL_MS)
      return
    }
    button?.setKeepScreenOn(true)
    if (inFlight && SystemClock.elapsedRealtime() - lastDispatchAt < lastChunkMs + CALLBACK_GRACE_MS) {
      schedule(INFLIGHT_POLL_MS)
      return
    }
    inFlight = false
    dispatchChunk()
  }

  private fun dispatchChunk() {
    val (width, height) = screenSize() ?: return schedule(IDLE_POLL_MS)
    val chunk = ScrollMath.compute(EnginePrefs.secs(this), height, resources.displayMetrics.density)
    val x = width * 0.5f
    val path = Path().apply {
      moveTo(x, chunk.startY)
      lineTo(x, chunk.endY)
    }
    val gesture = GestureDescription.Builder()
      .addStroke(GestureDescription.StrokeDescription(path, 0, chunk.durationMs))
      .build()
    currentGesture = gesture
    val accepted = runCatching { dispatchGesture(gesture, gestureCallback, null) }.getOrDefault(false)
    if (accepted) {
      inFlight = true
      lastDispatchAt = SystemClock.elapsedRealtime()
      lastChunkMs = chunk.durationMs
    } else {
      inFlight = false
      retry()
    }
  }

  private fun retry() {
    if (!running) return
    var delay = ScrollMath.retryDelayMs(retryCount)
    if (retryCount >= ScrollMath.RETRY_YIELD_THRESHOLD) delay = maxOf(delay, YIELD_DELAY_MS)
    retryCount++
    schedule(delay.toLong())
  }

  @Suppress("DEPRECATION")
  private fun screenSize(): Pair<Int, Int>? {
    val metrics = android.util.DisplayMetrics()
    (getSystemService(WINDOW_SERVICE) as WindowManager).defaultDisplay.getRealMetrics(metrics)
    return if (metrics.widthPixels > 0 && metrics.heightPixels > 0) metrics.widthPixels to metrics.heightPixels else null
  }
}
