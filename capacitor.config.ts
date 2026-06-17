import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.moonbug.app',
  appName: 'Moonbug',
  webDir: 'out',
  server: {
    url: 'http://localhost:9002',
    cleartext: true,
  },
};

export default config;
