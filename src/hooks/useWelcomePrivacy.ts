import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useWelcomePrivacy = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  useEffect(() => {
    const checkConsent = async () => {
      const consent = await AsyncStorage.getItem("privacyAccepted");
      if (!consent) {
        setShowPrivacyModal(true);
      }
    };
    checkConsent();
  }, []);

  const handleAcceptPrivacy = async () => {
    await AsyncStorage.setItem("privacyAccepted", new Date().toISOString());
    setShowPrivacyModal(false);
  };

  const handleRejectPrivacy = () => {
    console.log("El usuario rechazó el aviso de privacidad");
  };

  return {
    showPrivacyModal,
    setShowPrivacyModal,
    handleAcceptPrivacy,
    handleRejectPrivacy
  };
};