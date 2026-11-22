package expo.modules.scrollengine

import android.content.Context
import androidx.core.app.NotificationManagerCompat

object EngineState {
  var listener: ((Map<String, Any>) -> Unit)? = null

  fun snapshot(context: Context): Map<String, Any> = mapOf(
    "running" to (ScrollService.instance?.running ?: false),
    "serviceEnabled" to (ScrollService.instance != null),
    "secondsPerScreen" to EnginePrefs.secs(context),
    "notificationsEnabled" to NotificationManagerCompat.from(context).areNotificationsEnabled(),
  )

  fun emit(context: Context) {
    listener?.invoke(snapshot(context))
  }
}
