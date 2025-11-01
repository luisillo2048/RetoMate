import { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";

const welcomeSound = require("../../assets/audios/welcome.mp3");

export const useWelcomeAudio = () => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [soundPaused, setSoundPaused] = useState(false);

  useEffect(() => {
    const playSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(welcomeSound);
        soundRef.current = sound;
        await sound.playAsync();
      } catch (error) {
        console.log("Error al reproducir audio:", error);
      }
    };

    playSound();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, []);

  const toggleSound = async () => {
    try {
      const s = soundRef.current;
      if (!s) return;
      
      const status = await s.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await s.pauseAsync();
          setSoundPaused(true);
        } else {
          await s.playAsync();
          setSoundPaused(false);
        }
      }
    } catch (error) {
      console.log('Error toggling sound:', error);
    }
  };

  const setVolume = async (volume: number) => {
    try {
      const s = soundRef.current;
      if (!s) return;
      
      await s.setVolumeAsync(volume);
    } catch (error) {
      console.log('Error setting volume:', error);
    }
  };

  return {
    soundRef,
    soundPaused,
    setSoundPaused,
    toggleSound,
    setVolume
  };
};