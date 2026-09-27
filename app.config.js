const { execSync } = require('child_process');
const baseConfig = require('./app.json');

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
    package: 'com.company.petcare',
    googleServicesFile: './google-services.json',
  },
  extra: {
    ...baseConfig.expo.extra,
    commitHash: resolveCommitHash(),
    eas: {
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
