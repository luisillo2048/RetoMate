import 'dotenv/config';

export default {
  expo: {
    name: "RetoMate",
    slug: "retomate",
    version: "2.0.0",

    
    updates: {
      url: "https://u.expo.dev/99f8314e-850f-4c55-a9ce-768a8c78c1e0"
    },

    runtimeVersion: {
      policy: "appVersion"
    },

    orientation: "portrait",
    icon: "./assets/images/Logo.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/Logo.png",
      resizeMode: "contain",
      backgroundColor: "#c16060ff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/Logo.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.anonymous.frontendretomate",
      config: {
        ndk: {
          version: "27.0.12077973"
        }
      }
    },
    web: {
      favicon: "./assets/images/Logo.png"
    },
    extra: {
      API_URL: process.env.EXPO_PUBLIC_API_URL,
      eas: {
        projectId: "99f8314e-850f-4c55-a9ce-768a8c78c1e0"
      }
    }
  }
};
