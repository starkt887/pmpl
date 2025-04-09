import type { CapacitorConfig } from "@capacitor/cli";
import { Capacitor } from "@capacitor/core";
import { StatusBar } from "@capacitor/status-bar";

const config: CapacitorConfig = {
  appId: "com.ajskland.pmpl",
  appName: "Bus Route helper",
  webDir: "build",
  plugins: {
    // CapacitorHttp: {
    //   enabled: true,
    // },
    LocalNotifications: {},
  },
};

if (Capacitor.isNativePlatform()) {
  StatusBar.setOverlaysWebView({ overlay: false }); // Ensures the status bar does not overlap content
}

export default config;
