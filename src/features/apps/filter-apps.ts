type Named = { packageName: string; label: string }

export function filterApps<T extends Named>(apps: T[], query: string, selected: string[]) {
  const needle = query.trim().toLocaleLowerCase()
  const matches = needle
    ? apps.filter(
        ({ label, packageName }) =>
          label.toLocaleLowerCase().includes(needle) || packageName.includes(needle),
      )
    : apps
  return [...matches].sort(
    (a, b) => Number(selected.includes(b.packageName)) - Number(selected.includes(a.packageName)),
  )
}
