import { type NativeModule, requireNativeModule } from 'expo'

export type EngineState = {
  running: boolean
  serviceEnabled: boolean
  secondsPerScreen: number
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
  start(): boolean
  stop(): void
  setSecondsPerScreen(secs: number): void
  setAllowedPackages(packages: string[]): void
  setPreviewMode(enabled: boolean): void
  setLabels(labels: EngineLabels): void
  refreshControls(): void
  listLaunchableApps(): Promise<LaunchableApp[]>
}

const native = requireNativeModule<ScrollEngineNativeModule>('ScrollEngine')

export const ScrollEngine = {
  getState: () => native.getState(),
  openAccessibilitySettings: () => native.openAccessibilitySettings(),
  start: () => native.start(),
  stop: () => native.stop(),
  setSecondsPerScreen: (secs: number) => native.setSecondsPerScreen(secs),
  setAllowedPackages: (packages: string[]) => native.setAllowedPackages(packages),
  setPreviewMode: (enabled: boolean) => native.setPreviewMode(enabled),
  setLabels: (labels: EngineLabels) => native.setLabels(labels),
  refreshControls: () => native.refreshControls(),
  listLaunchableApps: () => native.listLaunchableApps(),
  addListener: native.addListener.bind(native) as ScrollEngineNativeModule['addListener'],
}
