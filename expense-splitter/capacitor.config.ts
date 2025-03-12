import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.coreykarnei.RipWise',
  appName: 'RipWise',
  webDir: 'build',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#4a6fa5",
      showSpinner: true,
      spinnerColor: "#ffffff",
    }
  },
  ios: {
    contentInset: "always",
    appendUserAgent: "ExpenseSplitter iOS App"
  },
  server: {
    allowNavigation: ["*"],
  },
};

export default config; 