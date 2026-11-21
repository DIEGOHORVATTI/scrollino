package expo.modules.scrollengine

import android.annotation.SuppressLint
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Handler
import android.os.Looper
import android.util.DisplayMetrics
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import kotlin.math.abs
import kotlin.math.roundToInt

@SuppressLint("ClickableViewAccessibility")
class FloatingButton(private val service: ScrollService) {
  companion object {
    private const val SIZE_DP = 54
    private const val SLOP_DP = 12
    private const val MARGIN_DP = 6
    private const val FADE_DELAY_MS = 3500L
    private const val FADE_ALPHA = 0.3f
    private const val LONG_PRESS_MS = 450L
    private const val PANEL_HIDE_MS = 3000L
    private const val DEFAULT_Y_RATIO = 0.62f
    private const val ACCENT = 0xFFD97706.toInt()
    private const val IDLE = 0xE62D2720.toInt()
    private const val PANEL_BG = 0xF0221D17.toInt()
  }

  private val windowManager = service.getSystemService(WindowManager::class.java)
  private val density = service.resources.displayMetrics.density
  private val size = dp(SIZE_DP)
  private val slop = dp(SLOP_DP)
  private val handler = Handler(Looper.getMainLooper())
  private val fadeTask = Runnable { if (running) ball.animate().alpha(FADE_ALPHA).setDuration(450).start() }
  private val hidePanelTask = Runnable { hidePanel() }
  private val longPressTask = Runnable { onLongPress() }

  private val ball = TextView(service).apply {
    setTextColor(Color.WHITE)
    textSize = 16f
    gravity = Gravity.CENTER
    typeface = Typeface.DEFAULT_BOLD
  }
  private val ballParams = overlayParams(size, size)

  private val speedLabel = TextView(service).apply {
    setTextColor(Color.WHITE)
    textSize = 15f
    gravity = Gravity.CENTER
    typeface = Typeface.DEFAULT_BOLD
    minWidth = dp(64)
  }
  private val panel = LinearLayout(service).apply {
    orientation = LinearLayout.HORIZONTAL
    gravity = Gravity.CENTER_VERTICAL
    background = GradientDrawable().apply {
      cornerRadius = dp(27).toFloat()
      setColor(PANEL_BG)
    }
    addView(stepButton("−", +1))
    addView(speedLabel)
    addView(stepButton("+", -1))
  }
  private val panelParams = overlayParams(WindowManager.LayoutParams.WRAP_CONTENT, size)

  private var running = false
  private var keepScreenOn = false
  private var panelVisible = false
  private var downX = 0f
  private var downY = 0f
  private var startX = 0
  private var startY = 0
  private var moved = false
  private var longPressed = false

  init {
    placeInitially()
    ball.setOnTouchListener { _, event -> onTouch(event) }
    ball.setOnClickListener { onTap() }
    refreshLabels()
  }

  fun show(isRunning: Boolean) {
    runCatching { windowManager.addView(ball, ballParams) }
    update(isRunning, EnginePrefs.secs(service))
  }

  fun update(isRunning: Boolean, secs: Int) {
    running = isRunning
    ball.text = if (isRunning) "❚❚" else "▶"
    ball.background = GradientDrawable().apply {
      shape = GradientDrawable.OVAL
      setColor(if (isRunning) ACCENT else IDLE)
      if (!isRunning) setStroke((1.5f * density).roundToInt(), 0x55FFFFFF)
    }
    speedLabel.text = "$secs s"
    if (isRunning) scheduleFade() else wake()
  }

  fun refreshLabels() {
    ball.contentDescription = EnginePrefs.label(service, "buttonDescription", "Start or pause scrolling")
  }

  fun setKeepScreenOn(enabled: Boolean) {
    if (enabled == keepScreenOn) return
    keepScreenOn = enabled
    ballParams.flags = if (enabled) {
      ballParams.flags or WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
    } else {
      ballParams.flags and WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON.inv()
    }
    runCatching { windowManager.updateViewLayout(ball, ballParams) }
  }

  fun remove() {
    handler.removeCallbacksAndMessages(null)
    hidePanel()
    runCatching { windowManager.removeView(ball) }
  }

  private fun onTouch(event: MotionEvent): Boolean {
    when (event.actionMasked) {
      MotionEvent.ACTION_DOWN -> {
        wake()
        startX = ballParams.x
        startY = ballParams.y
        downX = event.rawX
        downY = event.rawY
        moved = false
        longPressed = false
        handler.postDelayed(longPressTask, LONG_PRESS_MS)
      }
      MotionEvent.ACTION_MOVE -> {
        val dx = event.rawX - downX
        val dy = event.rawY - downY
        if (!moved && (abs(dx) > slop || abs(dy) > slop)) {
          moved = true
          handler.removeCallbacks(longPressTask)
          hidePanel()
        }
        if (moved) moveTo(startX + dx.toInt(), startY + dy.toInt())
      }
      MotionEvent.ACTION_UP -> {
        handler.removeCallbacks(longPressTask)
        when {
          moved -> savePosition()
          !longPressed -> ball.performClick()
        }
        scheduleFade()
      }
      MotionEvent.ACTION_CANCEL -> {
        handler.removeCallbacks(longPressTask)
        scheduleFade()
      }
      else -> return false
    }
    return true
  }

  private fun onTap() {
    if (panelVisible) return hidePanel()
    service.toggle()
    maybeShowHint()
  }

  private fun onLongPress() {
    longPressed = true
    ball.performHapticFeedback(android.view.HapticFeedbackConstants.LONG_PRESS)
    showPanel()
  }

  private fun stepButton(symbol: String, delta: Int) = TextView(service).apply {
    text = symbol
    setTextColor(Color.WHITE)
    textSize = 22f
    gravity = Gravity.CENTER
    layoutParams = LinearLayout.LayoutParams(size, size)
    contentDescription = symbol
    setOnClickListener {
      service.adjustSecs(delta)
      schedulePanelHide()
    }
  }

  private fun showPanel() {
    speedLabel.text = "${EnginePrefs.secs(service)} s"
    panel.measure(View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED)
    val width = panel.measuredWidth
    val (screenW, _) = screen()
    val leftOfBall = ballParams.x - width - dp(MARGIN_DP)
    panelParams.x = if (leftOfBall >= 0) leftOfBall else (ballParams.x + size + dp(MARGIN_DP)).coerceAtMost(screenW - width)
    panelParams.y = ballParams.y
    if (panelVisible) {
      runCatching { windowManager.updateViewLayout(panel, panelParams) }
    } else {
      panelVisible = runCatching { windowManager.addView(panel, panelParams) }.isSuccess
    }
    schedulePanelHide()
  }

  private fun hidePanel() {
    handler.removeCallbacks(hidePanelTask)
    if (!panelVisible) return
    panelVisible = false
    runCatching { windowManager.removeView(panel) }
  }

  private fun schedulePanelHide() {
    handler.removeCallbacks(hidePanelTask)
    handler.postDelayed(hidePanelTask, PANEL_HIDE_MS)
  }

  private fun maybeShowHint() {
    if (!EnginePrefs.consumeHint(service)) return
    runCatching {
      Toast.makeText(service, EnginePrefs.label(service, "buttonHint", "Tap to start or pause, hold to change speed, drag to move"), Toast.LENGTH_LONG).show()
    }
  }

  private fun placeInitially() {
    val (screenW, screenH) = screen()
    val saved = EnginePrefs.buttonPosition(service)
    if (saved != null) {
      moveTo((screenW * saved.first).toInt(), (screenH * saved.second).toInt(), apply = false)
    } else {
      moveTo(screenW - size - dp(MARGIN_DP), (screenH * DEFAULT_Y_RATIO).toInt(), apply = false)
    }
  }

  private fun moveTo(x: Int, y: Int, apply: Boolean = true) {
    val (screenW, screenH) = screen()
    ballParams.x = x.coerceIn(0, (screenW - size).coerceAtLeast(0))
    ballParams.y = y.coerceIn(0, (screenH - size).coerceAtLeast(0))
    if (apply) runCatching { windowManager.updateViewLayout(ball, ballParams) }
  }

  private fun savePosition() {
    val (screenW, screenH) = screen()
    EnginePrefs.setButtonPosition(service, ballParams.x / screenW.toFloat(), ballParams.y / screenH.toFloat())
  }

  private fun wake() {
    handler.removeCallbacks(fadeTask)
    ball.animate().cancel()
    ball.alpha = 1f
  }

  private fun scheduleFade() {
    handler.removeCallbacks(fadeTask)
    if (running) handler.postDelayed(fadeTask, FADE_DELAY_MS)
  }

  @Suppress("DEPRECATION")
  private fun screen(): Pair<Int, Int> {
    val metrics = DisplayMetrics()
    windowManager.defaultDisplay.getRealMetrics(metrics)
    return metrics.widthPixels.coerceAtLeast(1) to metrics.heightPixels.coerceAtLeast(1)
  }

  private fun overlayParams(width: Int, height: Int) = WindowManager.LayoutParams(
    width,
    height,
    WindowManager.LayoutParams.TYPE_ACCESSIBILITY_OVERLAY,
    WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
    PixelFormat.TRANSLUCENT,
  ).apply { gravity = Gravity.TOP or Gravity.START }

  private fun dp(value: Int) = (value * density).roundToInt()
}
