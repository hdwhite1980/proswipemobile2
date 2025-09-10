// hooks/useTabBarHeight.js - FIXED VERSION
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ✅ FIXED: Safe number conversion helper
const safeNumber = (value, fallback = 0) => {
  const num = Number(value);
  return isNaN(num) ? fallback : num;
};

export const useTabBarHeight = () => {
  const insets = useSafeAreaInsets();
  
  // ✅ FIXED: Ensure all inset values are safe numbers
  const safeInsets = {
    top: safeNumber(insets.top, 0),
    bottom: safeNumber(insets.bottom, 0),
    left: safeNumber(insets.left, 0),
    right: safeNumber(insets.right, 0),
  };
  
  // Base heights for different platforms
  const baseTabBarHeight = Platform.OS === 'ios' ? 49 : 56;
  
  // ✅ FIXED: Properly handle Android navigation bar (gesture/button navigation)
  const bottomPadding = Platform.select({
    ios: Math.max(safeInsets.bottom, 12), // iOS safe area
    android: Math.max(safeInsets.bottom, 16), // Use actual insets for Android nav bar
    default: 16
  });
  
  const topPadding = Platform.select({
    ios: 0,
    android: 8,
    default: 0
  });
  
  const totalHeight = baseTabBarHeight + bottomPadding + topPadding;
  
  // ✅ FIXED: Calculate content padding based on actual navigation bar height
  const androidNavBarHeight = Platform.OS === 'android' ? safeInsets.bottom : 0;
  const additionalContentPadding = Platform.select({
    ios: 20, // Standard iOS padding
    android: androidNavBarHeight > 0 ? 20 : 40, // More padding if no gesture nav
    default: 20
  });
  
  // ✅ FIXED: Ensure all return values are safe numbers
  const result = {
    height: totalHeight,
    paddingBottom: bottomPadding,
    paddingTop: topPadding,
    contentBottomPadding: totalHeight + additionalContentPadding,
    androidNavBarHeight: androidNavBarHeight,
    actualInsets: safeInsets,
  };
  
  // ✅ FIXED: Validate all numeric values before returning
  Object.keys(result).forEach(key => {
    if (key !== 'actualInsets' && typeof result[key] === 'number') {
      result[key] = safeNumber(result[key], 0);
    }
  });
  
  return result;
};