import 'dotenv/config';

export default {
  expo: {
    name: "RetoMate",
    slug: "retomate",
    version: "2.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo2.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/logo2.png",
      resizeMode: "contain",
      backgroundColor: "#c16060ff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo2.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.anonymous.frontendretomate"
    },
    web: {
      favicon: "./assets/images/logo2.png"
    },
    extra: {
      API_URL: process.env.EXPO_PUBLIC_API_URL,
      eas: {
        projectId: "3a393d5a-2c52-4dfd-84ac-343182c86f46"
      }
    }
  }
};
