import { PermissionsAndroid, Platform } from 'react-native'

const NOTIFICATIONS_PERMISSION_SDK = 33

export async function requestNotifications() {
  if (Platform.OS !== 'android' || Platform.Version < NOTIFICATIONS_PERMISSION_SDK) return true
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
  return result === PermissionsAndroid.RESULTS.GRANTED
}
