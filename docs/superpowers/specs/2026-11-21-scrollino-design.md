# Scrollino — design

Data: 2026-11-21

## Intenção

App Android que rola a tela sozinho, em velocidade constante, para ler sem
tocar no celular: livros, PDFs, artigos, mangá, cifras. Escrito do zero em Expo, na stack do Scale, publicada na Play Store
como o FakeTraveler (`~/Dev/FakeTraveler`).

## Objetivos

- Rolagem contínua e suave em qualquer app de leitura, ajustável de 3 a 60
  segundos por tela.
- Controle sem sair do livro: notificação fixa na gaveta com Mais devagar,
  Pausar/Iniciar e Mais rápido.
- Interface traduzida (pt-BR base + os mesmos 21 idiomas do FakeTraveler).
- Aprovada na Play Store, incluindo a política de serviço de acessibilidade.

## Não-objetivos

- Feeds (Reels, TikTok, Shorts): pular "um item por vez" é outro motor. Fora.
- iOS (não tem API equivalente).
- Ler ou entender o conteúdo da tela (detectar fim de capítulo, virar página
  em leitores paginados).

## Anti-objetivos

- Ler o conteúdo de outros apps. O serviço só injeta gestos;
  `canRetrieveWindowContent="false"`. Se isso mudar, a declaração na Play deixa
  de ser verdadeira.
- Qualquer rede, analytics ou anúncio. O app funciona offline.
- Build nativo na máquina do usuário (o PC esquenta). Build só no CI/EAS.

## Restrições

- Stack idêntica ao FakeTraveler/Scale: Expo 57, Expo Router, NativeWind 5,
  zustand, AsyncStorage, oxlint + oxfmt, `bun test`, código e commits sem
  comentários e sem menção ao Claude.
- Pacote `com.diegohorvatti.scrollino`, owner EAS `diegohorvatti`, `runtimeVersion`
  por fingerprint, OTA no canal `production`.
- minSdk 26, targetSdk o do Expo 57.
- Política da Play para AccessibilityService em app que não é ferramenta de
  acessibilidade: `isAccessibilityTool` falso, divulgação em destaque dentro do
  app com consentimento antes de abrir as configurações, formulário de
  declaração e vídeo no Console.

## Abordagens

1. **Expo + módulo Kotlin local (escolhida).** Interface em React Native,
   motor (AccessibilityService + notificação de controle) em `modules/scroll-engine`,
   igual ao `modules/mock-location` do FakeTraveler. Mesma stack e mesmo CD do
   Scale; motor nativo é obrigatório de qualquer jeito.
2. Só traduzir/forkar o app Java. Rápido, mas foge da stack, sem OTA, sem i18n
   padrão, sem CD. Descartada.
3. Biblioteca RN de acessibilidade de terceiros. Não existe uma madura que
   injete gestos contínuos. Descartada.

## O que foi decidido

### Motor (Kotlin)

- `ScrollService : AccessibilityService` com uma cadeia de gestos:
  trechos de ~1/4 de tela, duração calculada da velocidade, próximo trecho
  postado no `onCompleted`, recuo em `onCancelled` e nos gestos rejeitados
  (quando o usuário toca a tela). Portar `ScrollMath` e `ScrollPolicy`
  com os mesmos testes (agora em Kotlin/JUnit ou TS espelhado — ver
  "Deixado ao construtor").
- Para sozinho após 60 min; tela acesa (wake lock com timeout) enquanto rola;
  pausa quando a tela apaga ou quando o app em primeiro plano não é permitido,
  e retoma ao voltar.
- Não rola dentro do próprio Scrollino (exceto na prévia) nem com a gaveta de
  notificações aberta.

### Controles na gaveta de notificações (Kotlin)

- Decisão do usuário em 2026-11-21: trocar o botão flutuante pela gaveta.
- Notificação silenciosa e fixa enquanto o serviço está ligado: título
  "Rolando, uma tela a cada N s" ou "Pausado"; ações Mais devagar (+1 s),
  Pausar/Iniciar e Mais rápido (−1 s). Tocar abre o app.
- A rolagem já pausa com a gaveta aberta (`com.android.systemui`) e retoma ao
  fechar.
- Tela acesa durante a rolagem por wake lock com timeout (`WAKE_LOCK`).
- Permissão `POST_NOTIFICATIONS` pedida ao aceitar a divulgação e ao iniciar.

### Interface (React Native)

- **Início:** estado da permissão de acessibilidade,
  velocidade (slider logarítmico 3–60 s + atalhos
  Lento 20 s / Padrão 15 s / Rápido 10 s), apps permitidos, botão
  Iniciar/Pausar, link para a prévia.
- **Apps permitidos:** lista dos apps instaláveis com ícone e busca,
  multi-seleção. Vazio = todos.
- **Divulgação de acessibilidade:** tela própria antes de mandar o usuário
  para as configurações, explicando que o serviço só simula o deslize e não lê
  a tela; botões "Concordo" / "Agora não". Inclui a dica do Android 13+ para
  apps instalados por fora ("permitir configurações restritas").
- **Prévia:** texto longo de exemplo, original, em pt-BR (traduzido pelos
  locales), para testar a velocidade.
- **Sobre:** versão, créditos ao projeto MIT, link da política de privacidade.

### Ponte JS ↔ nativo (`modules/scroll-engine/index.ts`)

- `isServiceEnabled()`, `openAccessibilitySettings()`, `start()`, `stop()`, `isRunning()`,
  `setSecondsPerScreen(n)`, `setAllowedPackages(string[])`,
  `listLaunchableApps()`, `setPreviewMode(bool)`.
- Evento `onStateChange({ running, serviceEnabled })` para a tela refletir o
  que a notificação faz.
- Preferências do motor ficam em SharedPreferences (o serviço roda sem o JS);
  o JS é a fonte das mudanças e espelha o estado em zustand.

### Publicação

- CD copiado do FakeTraveler: `ci.yml`, `build-apk.yml`, `build-aab.yml`
  (envia para a Play), `ota-update.yml`. Secrets (keystore, PLAY_SERVICE_ACCOUNT_JSON,
  EXPO_TOKEN) quem configura é o usuário.
- `PRIVACY.md` (nada coletado, nada enviado), textos da loja nos idiomas,
  texto da declaração de acessibilidade e roteiro do vídeo exigido.
- Repo novo `DIEGOHORVATTI/scrollino`, **público**, no GitHub. A política de
  privacidade é o `PRIVACY.md` do repo, linkada na tela Sobre e na loja:
  `https://github.com/DIEGOHORVATTI/scrollino/blob/main/PRIVACY.md`.

## Deixado ao construtor

- Testar a matemática do motor em Kotlin (JUnit no CI) ou manter um espelho
  em TS só para teste; o que for mais simples no CI do FakeTraveler.
- Tile de configurações rápidas (Quick Settings) para iniciar/pausar: fazer se
  sair barato, senão fica para depois.
- Ícone: arte simples de pergaminho; gerar e redimensionar como no
  FakeTraveler.
- Layout fino das telas, desde que siga o tema do FakeTraveler/Scale.
