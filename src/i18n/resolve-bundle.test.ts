import { expect, it } from 'bun:test'

import { resolveBundle } from './resolve-bundle'

const bundles = { 'pt-BR': { pause: 'Pausar' }, es: { pause: 'Pausar es' } }

it('prefere a tag completa, cai pro idioma e depois pro vazio', () => {
  expect(resolveBundle(bundles, 'pt-BR', 'pt')).toBe(bundles['pt-BR'])
  expect(resolveBundle(bundles, 'es-AR', 'es')).toBe(bundles.es)
  expect(resolveBundle(bundles, 'fr-FR', 'fr')).toEqual({})
})
