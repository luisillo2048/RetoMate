import { useEffect, useRef, useState } from "react";
import { Animated, AccessibilityInfo } from "react-native";

export const useWelcomeAnimations = () => {
  const topLeftOpacity = useRef(new Animated.Value(0)).current;
  const topRightOpacity = useRef(new Animated.Value(0)).current;
  const bottomLeftOpacity = useRef(new Animated.Value(0)).current;
  const bottomRightOpacity = useRef(new Animated.Value(0)).current;

  const anim1Ref = useRef<Animated.CompositeAnimation | null>(null);
  const anim2Ref = useRef<Animated.CompositeAnimation | null>(null);
  const anim3Ref = useRef<Animated.CompositeAnimation | null>(null);
  const anim4Ref = useRef<Animated.CompositeAnimation | null>(null);

  const [animationsPaused, setAnimationsPaused] = useState(false);
  const [systemReduceMotion, setSystemReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(enabled => {
      setSystemReduceMotion(enabled);
      if (enabled) setAnimationsPaused(true);
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      enabled => {
        setSystemReduceMotion(enabled);
        if (enabled) {
          stopAllAnimations();
          setAnimationsPaused(true);
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const createAnimation = (animation: Animated.Value, delay: number) => {
    return Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(animation, { 
          toValue: 1, 
          duration: 500, 
          useNativeDriver: true 
        }),
        Animated.delay(500),
        Animated.timing(animation, { 
          toValue: 0, 
          duration: 500, 
          useNativeDriver: true 
        }),
      ])
    );
  };

  const initializeAnimations = () => {
    anim1Ref.current = createAnimation(topLeftOpacity, 0);
    anim2Ref.current = createAnimation(topRightOpacity, 500);
    anim3Ref.current = createAnimation(bottomLeftOpacity, 1000);
    anim4Ref.current = createAnimation(bottomRightOpacity, 1500);

    if (!systemReduceMotion && !animationsPaused) {
      startAllAnimations();
    }
  };

  const startAllAnimations = () => {
    anim1Ref.current?.start();
    anim2Ref.current?.start();
    anim3Ref.current?.start();
    anim4Ref.current?.start();
  };

  const stopAllAnimations = () => {
    anim1Ref.current?.stop();
    anim2Ref.current?.stop();
    anim3Ref.current?.stop();
    anim4Ref.current?.stop();
  };

  const toggleAnimations = () => {
    if (!animationsPaused) {
      stopAllAnimations();
      setAnimationsPaused(true);
    } else {
      startAllAnimations();
      setAnimationsPaused(false);
    }
  };

  return {
    topLeftOpacity,
    topRightOpacity,
    bottomLeftOpacity,
    bottomRightOpacity,
    animationsPaused,
    systemReduceMotion,
    initializeAnimations,
    startAllAnimations,
    stopAllAnimations,
    toggleAnimations,
    setAnimationsPaused
  };
};