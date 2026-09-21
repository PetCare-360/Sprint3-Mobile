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
  extra: {
    ...baseConfig.expo.extra,
    commitHash: resolveCommitHash(),
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
