package expo.modules.scrollengine

import android.content.BroadcastReceiver
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import androidx.core.app.NotificationManagerCompat

class EngineState(private val context: Context, private val onChange: (Map<String, Any>) -> Unit) {
  companion object {
    private const val REPLY_TIMEOUT_MS = 600L
  }

  private val handler = Handler(Looper.getMainLooper())
  private val waiting = mutableListOf<(Map<String, Any>) -> Unit>()
  private var running = false
  private var connected = false
  private var secs = ScrollMath.DEFAULT_SECS
  private var receiver: BroadcastReceiver? = null

  fun start() {
    receiver = EngineIntents.register(context, EngineIntents.STATE, ::onState)
  }

  fun stop() {
    receiver?.let { runCatching { context.unregisterReceiver(it) } }
    receiver = null
  }

  fun snapshot(): Map<String, Any> = mapOf(
    "running" to (connected && running),
    "serviceEnabled" to connected,
    "serviceStuck" to (!connected && enabledInSettings()),
    "secondsPerScreen" to secs,
    "notificationsEnabled" to NotificationManagerCompat.from(context).areNotificationsEnabled(),
  )

  fun request(reply: (Map<String, Any>) -> Unit) {
    connected = false
    waiting += reply
    EngineIntents.send(context, EngineIntents.REQUEST_STATE)
    handler.postDelayed({ flush() }, REPLY_TIMEOUT_MS)
  }

  fun setSecs(value: Int) {
    secs = ScrollMath.clampSecs(value)
    EngineIntents.send(context, EngineIntents.SET_SECS) { putExtra(EngineIntents.VALUE, secs) }
  }

  private fun onState(intent: Intent) {
    running = intent.getBooleanExtra(EngineIntents.RUNNING, false)
    secs = intent.getIntExtra(EngineIntents.SECS, secs)
    connected = intent.getBooleanExtra(EngineIntents.CONNECTED, false)
    flush()
    onChange(snapshot())
  }

  private fun flush() {
    if (waiting.isEmpty()) return
    val state = snapshot()
    waiting.toList().also { waiting.clear() }.forEach { it(state) }
  }

  private fun enabledInSettings(): Boolean {
    val component = ComponentName(context, ScrollService::class.java).flattenToString()
    val enabled = Settings.Secure.getString(context.contentResolver, Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES)
      ?: return false
    return enabled.split(':').any { it.equals(component, ignoreCase = true) }
  }
}
