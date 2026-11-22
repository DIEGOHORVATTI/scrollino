package expo.modules.scrollengine

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build

object EngineIntents {
  const val COMMAND = "expo.modules.scrollengine.COMMAND"
  const val STATE = "expo.modules.scrollengine.STATE"

  const val TYPE = "type"
  const val TOGGLE = "toggle"
  const val ADJUST = "adjust"
  const val SET_SECS = "setSecs"
  const val SET_ALLOWED = "setAllowed"
  const val SET_LABELS = "setLabels"
  const val REFRESH = "refresh"
  const val REQUEST_STATE = "requestState"

  const val VALUE = "value"
  const val KEYS = "keys"
  const val VALUES = "values"
  const val RUNNING = "running"
  const val SECS = "secs"
  const val CONNECTED = "connected"

  fun command(context: Context, type: String) =
    Intent(COMMAND).setPackage(context.packageName).putExtra(TYPE, type)

  fun send(context: Context, type: String, extras: Intent.() -> Unit = {}) =
    context.sendBroadcast(command(context, type).apply(extras))

  fun register(context: Context, action: String, onReceive: (Intent) -> Unit): BroadcastReceiver {
    val receiver = object : BroadcastReceiver() {
      override fun onReceive(context: Context, intent: Intent) = onReceive(intent)
    }
    val filter = IntentFilter(action)
    if (Build.VERSION.SDK_INT >= 33) {
      context.registerReceiver(receiver, filter, Context.RECEIVER_NOT_EXPORTED)
    } else {
      context.registerReceiver(receiver, filter)
    }
    return receiver
  }
}
