import { type NativeModule, requireNativeModule } from 'expo'

export type EngineState = {
  running: boolean
  serviceEnabled: boolean
  secondsPerScreen: number
  notificationsEnabled: boolean
}

export type LaunchableApp = {
  packageName: string
  label: string
  icon: string
}

export type EngineLabels = {
  autoStopped: string
  controlsChannel: string
  notifScrolling: string
  notifPaused: string
  actionStart: string
  actionPause: string
  actionSlower: string
  actionFaster: string
}

type ScrollEngineEvents = {
  onStateChange: (state: EngineState) => void
}

declare class ScrollEngineNativeModule extends NativeModule<ScrollEngineEvents> {
  getState(): EngineState
  openAccessibilitySettings(): void
  setSecondsPerScreen(secs: number): void
  setAllowedPackages(packages: string[]): void
  openNotificationSettings(): void
  setLabels(labels: EngineLabels): void
  refreshControls(): void
  listLaunchableApps(): Promise<LaunchableApp[]>
}

const native = requireNativeModule<ScrollEngineNativeModule>('ScrollEngine')

export const ScrollEngine = {
  getState: () => native.getState(),
  openAccessibilitySettings: () => native.openAccessibilitySettings(),
  setSecondsPerScreen: (secs: number) => native.setSecondsPerScreen(secs),
  setAllowedPackages: (packages: string[]) => native.setAllowedPackages(packages),
  openNotificationSettings: () => native.openNotificationSettings(),
  setLabels: (labels: EngineLabels) => native.setLabels(labels),
  refreshControls: () => native.refreshControls(),
  listLaunchableApps: () => native.listLaunchableApps(),
  addListener: native.addListener.bind(native) as ScrollEngineNativeModule['addListener'],
}
