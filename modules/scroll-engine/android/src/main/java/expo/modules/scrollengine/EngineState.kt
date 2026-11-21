package expo.modules.scrollengine

import android.content.ComponentName
import android.content.Context
import android.provider.Settings

object EngineState {
  var listener: ((Map<String, Any>) -> Unit)? = null

  fun isServiceEnabled(context: Context): Boolean {
    val component = ComponentName(context, ScrollService::class.java).flattenToString()
    val enabled = Settings.Secure.getString(
      context.contentResolver,
      Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES,
    ) ?: return false
    return enabled.split(':').any { it.equals(component, ignoreCase = true) }
  }

  fun snapshot(context: Context): Map<String, Any> = mapOf(
    "running" to (ScrollService.instance?.running ?: false),
    "serviceEnabled" to (ScrollService.instance != null || isServiceEnabled(context)),
    "secondsPerScreen" to EnginePrefs.secs(context),
  )

  fun emit(context: Context) {
    listener?.invoke(snapshot(context))
  }
}
