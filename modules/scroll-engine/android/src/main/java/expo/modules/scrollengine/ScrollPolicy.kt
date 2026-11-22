package expo.modules.scrollengine

object ScrollPolicy {
  private const val SYSTEM_UI = "com.android.systemui"

  fun shouldScroll(foreground: String, self: String, allowed: Set<String>): Boolean {
    if (foreground.isEmpty()) return true
    if (foreground == self || foreground.startsWith(SYSTEM_UI)) return false
    return allowed.isEmpty() || foreground in allowed
  }

  fun tracksForeground(packageName: String, className: String, self: String): Boolean {
    if (className.contains("Toast")) return false
    if (packageName == self) return className.endsWith("Activity")
    return true
  }
}
