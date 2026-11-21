import { expect, it } from 'bun:test'

import { filterApps } from './filter-apps'

const apps = [
  { packageName: 'com.amazon.kindle', label: 'Kindle' },
  { packageName: 'com.google.android.apps.docs', label: 'Drive' },
  { packageName: 'com.adobe.reader', label: 'Adobe Acrobat' },
]

it('busca pelo nome sem diferenciar maiúsculas', () => {
  expect(filterApps(apps, 'kin', []).map(({ label }) => label)).toEqual(['Kindle'])
})

it('busca pelo pacote', () => {
  expect(filterApps(apps, 'adobe', []).map(({ label }) => label)).toEqual(['Adobe Acrobat'])
})

it('mostra os selecionados primeiro mantendo a ordem do resto', () => {
  expect(filterApps(apps, '', ['com.adobe.reader']).map(({ label }) => label)).toEqual([
    'Adobe Acrobat',
    'Kindle',
    'Drive',
  ])
})

it('busca vazia ou só espaços devolve todos', () => {
  expect(filterApps(apps, '   ', [])).toHaveLength(3)
})
