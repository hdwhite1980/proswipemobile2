import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../config/theme';

const EnhancedCard = ({ children, style, onPress, ...props }) => {
  const [pressed, setPressed] = useState(false);
  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[
        styles.enhancedCard,
        pressed && styles.enhancedCardPressed,
        style,
      ]}
      onPress={onPress}
      onPressIn={() => onPress && setPressed(true)}
      onPressOut={() => onPress && setPressed(false)}
      activeOpacity={onPress ? 0.9 : 1}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  enhancedCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: theme.spacing.lg,
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: theme.spacing.md,
  },
  enhancedCardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
});

export default EnhancedCard;