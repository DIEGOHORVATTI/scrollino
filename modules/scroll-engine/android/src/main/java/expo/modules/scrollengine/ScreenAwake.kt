package expo.modules.scrollengine

import android.content.Context
import android.os.PowerManager
import android.os.SystemClock

class ScreenAwake(context: Context) {
  companion object {
    private const val TIMEOUT_MS = 10 * 60 * 1000L
    private const val REFRESH_MS = 60 * 1000L
  }

  @Suppress("DEPRECATION")
  private val lock = (context.getSystemService(Context.POWER_SERVICE) as PowerManager)
    .newWakeLock(PowerManager.SCREEN_DIM_WAKE_LOCK, "Scrollino:scroll")
    .apply { setReferenceCounted(false) }
  private var refreshedAt = 0L

  fun hold() {
    val now = SystemClock.elapsedRealtime()
    if (lock.isHeld && now - refreshedAt < REFRESH_MS) return
    runCatching { lock.acquire(TIMEOUT_MS) }
    refreshedAt = now
  }

  fun release() {
    if (lock.isHeld) runCatching { lock.release() }
    refreshedAt = 0L
  }
}
