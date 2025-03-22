import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "ionic-app-base",
  webDir: "build",
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
