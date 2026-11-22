# Declaração de uso da API de acessibilidade (Play Console)

Play Console › Conteúdo do app › Serviços de acessibilidade.

**O app é uma ferramenta de acessibilidade?** Não (`isAccessibilityTool="false"`).

**Recurso principal que usa a API:**

> Scrollino is an auto-scroll app for hands-free reading. Its core feature is to scroll other apps (e-book readers, PDF readers, browsers) at a constant, user-chosen speed. Android offers no other API that lets an app scroll the screen of another app, so Scrollino uses AccessibilityService.dispatchGesture() to perform a slow vertical swipe while the user has scrolling turned on. It also listens to TYPE_WINDOW_STATE_CHANGED only to know the foreground package name, kept in memory, so it scrolls only inside the apps the user selected and pauses in the notification shade. canRetrieveWindowContent is false: the service cannot read screen content. No data is collected, stored or transmitted; the app has no INTERNET permission.

**Divulgação em destaque:** tela "Antes de ativar o Scrollino" (`app/disclosure.tsx`), mostrada antes de abrir as configurações de acessibilidade, com botões "Concordo, abrir configurações" e "Agora não".

## Roteiro do vídeo (até 1 min, gravar com o Den Den ou scrcpy)

1. Abrir o Scrollino com o serviço desligado; tocar em "Serviço de acessibilidade".
2. Mostrar a tela de divulgação inteira; tocar em "Concordo, abrir configurações".
3. Ativar o Scrollino em Configurações › Acessibilidade e aceitar o aviso do sistema.
4. Voltar, escolher um leitor de PDF em "Apps", ajustar a velocidade.
5. Tocar em Iniciar rolagem, abrir um PDF longo: a página rola sozinha.
6. Puxar a gaveta de notificações, tocar em Mais rápido e em Pausar.
