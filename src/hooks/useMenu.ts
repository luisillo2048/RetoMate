import { useState} from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

export const useMenu = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();

  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const openDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      closeDrawer();
      
      setTimeout(async () => {
        await logout();
        navigation.navigate("Login" as never);
      }, 350);
    } catch (error) {
      console.error('Error durante logout:', error);
      setIsLoggingOut(false);
    }
  };

  const playAudio = (audioType: string) => {
    console.log(`Reproduciendo audio: ${audioType}`);
  };

  return {
    isDrawerVisible,
    chatVisible,
    isLoggingOut,
    setDrawerVisible,
    setChatVisible,
    openDrawer,
    closeDrawer,
    handleLogout,
    playAudio
  };
};