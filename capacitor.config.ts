import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'loto-facile',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    cleartext: true,
    url: 'http://192.168.1.22:8100',
  },
};

export default config;
