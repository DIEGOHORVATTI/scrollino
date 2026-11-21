package expo.modules.scrollengine

import android.content.Context

object EnginePrefs {
  private const val FILE = "scrollino_engine"
  private const val SECS = "secs"
  private const val ALLOWED = "allowed"
  private const val BUTTON_X = "button_x"
  private const val BUTTON_Y = "button_y"
  private const val LABEL_PREFIX = "label_"
  private const val HINT_SHOWN = "hint_shown"

  private fun prefs(context: Context) = context.getSharedPreferences(FILE, Context.MODE_PRIVATE)

  fun secs(context: Context) =
    ScrollMath.clampSecs(prefs(context).getInt(SECS, ScrollMath.DEFAULT_SECS))

  fun setSecs(context: Context, secs: Int) =
    prefs(context).edit().putInt(SECS, ScrollMath.clampSecs(secs)).apply()

  fun allowed(context: Context): Set<String> =
    prefs(context).getStringSet(ALLOWED, emptySet())?.toSet() ?: emptySet()

  fun setAllowed(context: Context, packages: Set<String>) =
    prefs(context).edit().putStringSet(ALLOWED, packages).apply()

  fun buttonPosition(context: Context): Pair<Float, Float>? {
    val p = prefs(context)
    if (!p.contains(BUTTON_X)) return null
    return p.getFloat(BUTTON_X, 0f) to p.getFloat(BUTTON_Y, 0f)
  }

  fun setButtonPosition(context: Context, x: Float, y: Float) =
    prefs(context).edit().putFloat(BUTTON_X, x).putFloat(BUTTON_Y, y).apply()

  fun label(context: Context, key: String, fallback: String) =
    prefs(context).getString(LABEL_PREFIX + key, null) ?: fallback

  fun setLabels(context: Context, labels: Map<String, String>) {
    val editor = prefs(context).edit()
    labels.forEach { (key, value) -> editor.putString(LABEL_PREFIX + key, value) }
    editor.apply()
  }

  fun consumeHint(context: Context): Boolean {
    val p = prefs(context)
    if (p.getBoolean(HINT_SHOWN, false)) return false
    p.edit().putBoolean(HINT_SHOWN, true).apply()
    return true
  }
}
