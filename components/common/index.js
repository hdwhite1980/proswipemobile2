// components/common/index.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  StyleSheet 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../config/theme';

// Create styles locally
const styles = StyleSheet.create({
  // Enhanced Button Styles
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

  // Enhanced Input Styles
  inputContainer: {
    marginBottom: theme.spacing.md,
    paddingHorizontal: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    borderWidth: 2,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    minHeight: 48,
  },
  inputWrapperFocused: {
    borderColor: theme.colors.primary,
  },
  inputWrapperError: {
    borderColor: theme.colors.error,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  enhancedInput: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
  },
  inputError: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },

  // Enhanced Card Styles
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

// Enhanced Button Component
export const EnhancedButton = ({ 
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

// Enhanced Input Component
export const EnhancedInput = ({ 
  placeholder, 
  value, 
  onChangeText, 
  icon, 
  error,
  ...props 
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <View style={[
        styles.inputWrapper,
        focused && styles.inputWrapperFocused,
        error && styles.inputWrapperError,
      ]}>
        {icon && (
          <Icon 
            name={icon} 
            size={20} 
            color={focused ? theme.colors.primary : theme.colors.textSecondary}
            style={styles.inputIcon}
          />
        )}
        <TextInput
          style={styles.enhancedInput}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      </View>
      {error && <Text style={styles.inputError}>{error}</Text>}
    </View>
  );
};

// Enhanced Card Component
export const EnhancedCard = ({ children, style, onPress, ...props }) => {
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