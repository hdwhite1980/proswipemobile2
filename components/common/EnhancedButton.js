import React, { useState } from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../config/theme';

const EnhancedButton = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  icon, 
  loading = false, 
  disabled = false,
  style,
  ...props 
}) => {
  const [pressed, setPressed] = useState(false);

  const handlePress = () => {
    console.log(`🔘 Button pressed: ${title}`);
    if (onPress && !disabled && !loading) {
      onPress();
    }
  };

  const buttonStyles = [
    styles.enhancedButton,
    variant === 'primary' && styles.primaryButton,
    variant === 'secondary' && styles.secondaryButton,
    variant === 'outline' && styles.outlineButton,
    variant === 'ghost' && styles.ghostButton,
    (disabled || loading) && styles.disabledButton,
    pressed && styles.pressedButton,
    style,
  ];

  const textStyles = [
    styles.enhancedButtonText,
    variant === 'primary' && styles.primaryButtonText,
    variant === 'secondary' && styles.secondaryButtonText,
    variant === 'outline' && styles.outlineButtonText,
    variant === 'ghost' && styles.ghostButtonText,
    (disabled || loading) && styles.disabledButtonText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={handlePress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      <View style={styles.buttonContent}>
        {loading && (
          <ActivityIndicator 
            size="small" 
            color={variant === 'primary' ? '#FFFFFF' : theme.colors.primary}
            style={styles.buttonLoader}
          />
        )}
        {icon && !loading && (
          <Icon 
            name={icon} 
            size={20} 
            color={variant === 'primary' ? '#FFFFFF' : theme.colors.primary}
            style={styles.buttonIcon}
          />
        )}
        <Text style={textStyles}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  enhancedButton: {
    borderRadius: theme.roundness,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary,
  },
  outlineButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  disabledButton: {
    opacity: 0.6,
  },
  pressedButton: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: theme.spacing.sm,
  },
  buttonLoader: {
    marginRight: theme.spacing.sm,
  },
  enhancedButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
  },
  outlineButtonText: {
    color: theme.colors.primary,
  },
  ghostButtonText: {
    color: theme.colors.primary,
  },
  disabledButtonText: {
    opacity: 0.7,
  },
});

export default EnhancedButton;