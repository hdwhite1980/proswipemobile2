import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../config/theme';

const EnhancedInput = ({ 
  placeholder, 
  value, 
  onChangeText, 
  icon, 
  error,
  style,
  ...props 
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.inputContainer, style]}>
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

const styles = StyleSheet.create({
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
});

export default EnhancedInput;