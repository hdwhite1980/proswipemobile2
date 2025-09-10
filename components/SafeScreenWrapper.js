// ===== FILE 6: components/SafeScreenWrapper.js =====
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const SafeScreenWrapper = ({ 
  children, 
  hasTabBar = true, 
  style,
  backgroundColor = '#F8FAFC' // Your theme background color
}) => {
  const edges = hasTabBar ? ['top'] : ['top', 'bottom'];
  
  return (
    <SafeAreaView 
      style={[{ flex: 1, backgroundColor }, style]} 
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
};

export default SafeScreenWrapper;