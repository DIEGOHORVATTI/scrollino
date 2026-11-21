import { useState } from 'react'
import { Check } from 'lucide-react-native'
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from 'react-native'

import { SearchInput } from '@/src/components/ui/search-input'
import { filterApps } from '@/src/features/apps/filter-apps'
import { useLaunchableApps } from '@/src/features/apps/use-launchable-apps'
import { t } from '@/src/i18n'
import { useSettings } from '@/src/stores/settings-store'
import { useThemeColors } from '@/src/theme/colors'

export default function AppsScreen() {
  const colors = useThemeColors()
  const apps = useLaunchableApps()
  const [query, setQuery] = useState('')
  const selected = useSettings((state) => state.allowedPackages)
  const { toggleAllowed, update } = useSettings.getState()

  return (
    <View className="flex-1 bg-bg-primary">
      <View className="gap-3 p-4">
        <Text className="text-sm leading-5 text-text-secondary">{t('appsHint')}</Text>
        <SearchInput
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
          placeholder={t('appsSearch')}
        />
        {selected.length ? (
          <Pressable onPress={() => update({ allowedPackages: [] })} className="self-start py-1">
            <Text className="text-sm font-semibold text-primary">{t('appsClear')}</Text>
          </Pressable>
        ) : null}
      </View>
      {apps ? (
        <FlatList
          data={filterApps(apps, query, selected)}
          keyExtractor={({ packageName }) => packageName}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => {
            const checked = selected.includes(item.packageName)
            return (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                onPress={() => toggleAllowed(item.packageName)}
                className="flex-row items-center gap-3 border-b border-border py-3 active:opacity-70"
              >
                <Image source={{ uri: item.icon }} className="h-10 w-10" />
                <Text className="flex-1 text-base text-text-primary" numberOfLines={1}>
                  {item.label}
                </Text>
                <View
                  className={`h-6 w-6 items-center justify-center rounded-md border-2 ${
                    checked ? 'border-primary bg-primary' : 'border-border'
                  }`}
                >
                  {checked ? <Check size={16} color="#ffffff" /> : null}
                </View>
              </Pressable>
            )
          }}
        />
      ) : (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator color={colors.accent} />
          <Text className="text-sm text-text-muted">{t('appsLoading')}</Text>
        </View>
      )}
    </View>
  )
}
