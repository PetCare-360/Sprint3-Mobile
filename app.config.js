const { execSync } = require('child_process');

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
  name: 'sprint',
  slug: 'sprint',
  version: '2.0.0',
  orientation: 'portrait',
  icon: './public/branco.png',
  userInterfaceStyle: 'light',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.company.petcare',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './public/branco.png',
      backgroundColor: '#ffffff',
    },
    predictiveBackGestureEnabled: false,
    package: 'com.company.petcare',
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
    'expo-secure-store',
  ],
};