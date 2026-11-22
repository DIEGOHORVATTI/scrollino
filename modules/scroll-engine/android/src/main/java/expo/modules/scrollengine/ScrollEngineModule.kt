package expo.modules.scrollengine

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.provider.Settings
import android.util.Base64
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.ByteArrayOutputStream

class ScrollEngineModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  override fun definition() = ModuleDefinition {
    Name("ScrollEngine")

    Events("onStateChange")

    OnStartObserving {
      EngineState.listener = { state -> sendEvent("onStateChange", state) }
    }

    OnStopObserving {
      EngineState.listener = null
    }

    OnActivityEntersForeground {
      EngineState.emit(context)
    }

    Function("getState") { EngineState.snapshot(context) }

    Function("openNotificationSettings") {
      context.startActivity(
        Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS)
          .putExtra(Settings.EXTRA_APP_PACKAGE, context.packageName)
          .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK),
      )
    }

    Function("openAccessibilitySettings") {
      context.startActivity(
        Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK),
      )
    }

    Function("setSecondsPerScreen") { secs: Int ->
      EnginePrefs.setSecs(context, secs)
      ScrollService.instance?.adjustSecs(0) ?: EngineState.emit(context)
    }

    Function("setAllowedPackages") { packages: List<String> ->
      EnginePrefs.setAllowed(context, packages.toSet())
    }


    Function("setLabels") { labels: Map<String, String> ->
      EnginePrefs.setLabels(context, labels)
      ScrollService.instance?.refreshControls()
    }

    Function("refreshControls") { ScrollService.instance?.refreshControls() }

    AsyncFunction("listLaunchableApps") { listLaunchableApps() }
  }

  private fun listLaunchableApps(): List<Map<String, String>> {
    val manager = context.packageManager
    val launcher = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
    return manager.queryIntentActivities(launcher, PackageManager.MATCH_ALL)
      .map { it.activityInfo.applicationInfo }
      .filter { it.packageName != context.packageName }
      .distinctBy { it.packageName }
      .map { info ->
        mapOf(
          "packageName" to info.packageName,
          "label" to manager.getApplicationLabel(info).toString(),
          "icon" to iconDataUri(manager.getApplicationIcon(info)),
        )
      }
      .sortedBy { it["label"]?.lowercase() }
  }

  private fun iconDataUri(drawable: android.graphics.drawable.Drawable): String {
    val px = (40 * context.resources.displayMetrics.density).toInt()
    val bitmap = Bitmap.createBitmap(px, px, Bitmap.Config.ARGB_8888)
    drawable.setBounds(0, 0, px, px)
    drawable.draw(Canvas(bitmap))
    val bytes = ByteArrayOutputStream().also { bitmap.compress(Bitmap.CompressFormat.PNG, 100, it) }
    bitmap.recycle()
    return "data:image/png;base64," + Base64.encodeToString(bytes.toByteArray(), Base64.NO_WRAP)
  }
}
