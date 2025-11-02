import { Animated } from "react-native";
import { Audio } from "expo-av";

export interface WelcomeAnimations {
  topLeftOpacity: Animated.Value;
  topRightOpacity: Animated.Value;
  bottomLeftOpacity: Animated.Value;
  bottomRightOpacity: Animated.Value;
}

export interface WelcomeAudio {
  soundRef: React.MutableRefObject<Audio.Sound | null>;
  playAudio: (soundFile: any) => Promise<void>;
  stopAudio: () => Promise<void>;
}
