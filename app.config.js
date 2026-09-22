const { execSync } = require('child_process');
const baseConfig = require('./app.json');

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

module.exports = {
  ...baseConfig.expo,
  android: {
    ...baseConfig.expo.android,
    // Identificador único do app nas lojas/Firebase (formato reverso de domínio).
    // Depois de definido, não deve mudar — trocar o package troca o "app" do
    // ponto de vista do Android/Firebase/Play Store.
    package: 'com.company.petcare',
  },
  extra: {
    ...baseConfig.expo.extra,
    commitHash: resolveCommitHash(),
    eas: {
      // Preenchido automaticamente pelo comando `eas init` na primeira vez
      // (ele imprime o projectId no terminal). Como este é um app.config.js
      // dinâmico, o EAS CLI não consegue gravar esse valor sozinho aqui —
      // cole o UUID retornado manualmente após rodar `eas init`.
      projectId: 'e1e702ce-3e65-4300-8125-f5a08578d831',
    },
  },
  plugins: [
    ...(baseConfig.expo.plugins ?? []),
    [
      'expo-notifications',
      {
        icon: './assets/notifications/notification-icon.png',
        color: '#8B5CF6',
      },
    ],
  ],
};
