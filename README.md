# Scrollino

Leitura sem as mãos: o Scrollino rola a tela sozinho, em velocidade constante, dentro de qualquer app de leitura (e-books, PDFs, artigos, mangá, cifras).

- Velocidade de 3 a 60 segundos por tela, com atalhos Lento, Padrão e Rápido
- Controles na gaveta de notificações: mais devagar, pausar/iniciar, mais rápido
- Escolha em quais apps ele rola
- Para sozinho depois de 60 minutos e mantém a tela acesa só enquanto rola
- Sem internet, sem anúncios, sem coleta de dados ([política de privacidade](PRIVACY.md))
- 21 idiomas

## Stack

Expo 57, Expo Router, NativeWind 5, zustand. O motor é um módulo Kotlin local (`modules/scroll-engine`) com um `AccessibilityService` que só injeta gestos (`canRetrieveWindowContent="false"`).

## Desenvolvimento

```bash
bun install
bun run check
```

Builds nativos rodam no GitHub Actions: `build-apk.yml` (APK de teste), `build-aab.yml` (Play Store) e `ota-update.yml` (EAS Update).
