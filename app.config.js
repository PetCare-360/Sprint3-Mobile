const { execSync } = require('child_process');

/**
 * Resolve o hash do commit de referência da build, para a tela "Sobre o App".
 * - Em build via EAS, a própria EAS já expõe o hash pela env var
 *   EAS_BUILD_GIT_COMMIT_HASH — não depende de o worker ter o histórico git completo.
 * - Em desenvolvimento local (expo start), cai para `git rev-parse HEAD` no repositório atual.
 * - Se nenhum dos dois estiver disponível (ex.: build fora de um repo git), usa 'dev'
 *   em vez de quebrar o build.
 */
function resolveCommitHash() {
  if (process.env.EAS_BUILD_GIT_COMMIT_HASH) {
    return process.env.EAS_BUILD_GIT_COMMIT_HASH;
  }
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch (error) {
    return 'dev';
  }
}

// Fonte única de configuração (sem app.json — SDK 57 + expo-doctor reclama
// se os dois existirem ao mesmo tempo, então consolidamos tudo aqui).
// New Architecture e edge-to-edge são o padrão desde o SDK 55 e não são
// mais campos configuráveis — por isso não aparecem mais abaixo.
module.exports = {
  name: 'sprint',
  slug: 'sprint',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  ios: {
    supportsTablet: true,
    // Equivalente iOS do android.package — precisa bater com o Bundle ID
    // registrado no seu Apple Developer / App Store Connect.
    bundleIdentifier: 'com.company.petcare',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    predictiveBackGestureEnabled: false,
    // Identificador único do app nas lojas/Firebase (formato reverso de domínio).
    // Depois de definido, não deve mudar — trocar o package troca o "app" do
    // ponto de vista do Android/Firebase/Play Store.
    package: 'com.company.petcare',
    // Necessário para o expo-notifications inicializar no Android em builds
    // nativos (dev client / preview / production) — sem isso o app crasha
    // na abertura, mesmo usando só notificação local. Baixado do Firebase
    // Console → Configurações do projeto → app Android com.company.petcare.
    googleServicesFile: './google-services.json',
  },
  web: {
    favicon: './assets/favicon.png',
  },
  updates: {
    url: 'https://u.expo.dev/e1e702ce-3e65-4300-8125-f5a08578d831',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  extra: {
    commitHash: resolveCommitHash(),
    eas: {
      projectId: 'e1e702ce-3e65-4300-8125-f5a08578d831',
    },
  },
  plugins: [
    'expo-status-bar',
    [
      // Substitui o antigo campo "splash" (removido do schema no SDK 57)
      // pelos mesmos valores, agora via plugin.
      'expo-splash-screen',
      {
        image: './assets/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/notifications/notification-icon.png',
        color: '#8B5CF6',
      },
    ],
  ],
};
