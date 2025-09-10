// components/themed/index.js - Reusable Themed Components
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

// Create a local theme hook and theme object to avoid import issues
// You can move this to a separate theme file later
import { createContext, useContext } from 'react';

// ProSwipe Theme Configuration (embedded to avoid import issues)
export const ProSwipeTheme = {
  colors: {
    // Primary Brand Colors
    primary: '#FF6B35', // Primary Orange
    primaryLight: '#FF8A65',
    primaryDark: '#FF5722', // Secondary Orange
    
    // Secondary Brand Colors
    secondary: '#007AFF', // Blue
    secondaryLight: '#4FC3F7',
    secondaryDark: '#0051D5', // Dark Blue
    
    // Accent Colors
    accent: '#FFD700', // Gold
    accentOrange: '#FFA500', // Orange Accent
    yellow: '#FF9F0A',
    yellowDark: '#FF8C00', // Dark Yellow
    
    // Success & Status Colors
    success: '#32D74B', // Green
    successDark: '#28CD41', // Dark Green
    warning: '#FF9F0A',
    error: '#EF4444',
    info: '#007AFF',
    
    // Background Colors
    background: '#FFFFFF', // Pure white
    backgroundSecondary: '#F8FAFC',
    backgroundTertiary: '#F1F5F9',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    surfaceSecondary: '#FAFAFA',
    
    // Text Colors
    text: '#1F2937',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textLight: '#FFFFFF',
    textMuted: '#64748B',
    
    // Border & Divider Colors
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    borderFocus: '#FF6B35',
    divider: '#E5E7EB',
    
    // Overlay & Shadow Colors
    overlay: 'rgba(0, 0, 0, 0.1)',
    overlayDark: 'rgba(0, 0, 0, 0.3)',
    shadow: 'rgba(255, 107, 53, 0.1)',
    shadowDark: 'rgba(255, 107, 53, 0.2)',
    
    // Card & Component Colors
    card: '#FFFFFF',
    cardSecondary: '#F8FAFC',
    input: '#FFFFFF',
    inputFocus: '#FFFFFF',
  },

  gradients: {
    // Primary Gradients
    primary: ['#FF6B35', '#FF5722'], // Orange gradients
    primaryExtended: ['#FF6B35', '#FF5722', '#FFA500'],
    
    // Secondary Gradients
    secondary: ['#007AFF', '#0051D5'], // Blue gradients
    secondaryExtended: ['#007AFF', '#0051D5', '#4FC3F7'],
    
    // Background Gradients
    background: ['#FFFFFF', '#F8FAFC'],
    backgroundSoft: ['#FAFAFA', '#F1F5F9'],
    
    // Button Gradients
    button: ['#FF6B35', '#FF5722'],
    buttonSecondary: ['#007AFF', '#0051D5'],
    buttonSuccess: ['#32D74B', '#28CD41'],
    
    // Accent Gradients
    warm: ['#FFD700', '#FFA500', '#FF9F0A'], // Gold to orange
    sunset: ['#FF6B35', '#FF9F0A', '#FFD700'],
    ocean: ['#007AFF', '#4FC3F7', '#00BCD4'],
    
    // Card Gradients
    card: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)'],
    cardElevated: ['rgba(255, 255, 255, 1)', 'rgba(248, 250, 252, 1)'],
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    round: 999,
  },

  typography: {
    // Font Sizes
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
      display: 40,
    },
    
    // Font Weights
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    
    // Line Heights
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
      loose: 1.8,
    },
  },

  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    small: {
      shadowColor: '#FF6B35',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    medium: {
      shadowColor: '#FF6B35',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
    },
    large: {
      shadowColor: '#FF6B35',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 12,
    },
    xl: {
      shadowColor: '#FF6B35',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 16,
    },
  },

  // Component-specific styles
  components: {
    button: {
      height: 56,
      borderRadius: 16,
      paddingHorizontal: 24,
    },
    input: {
      height: 56,
      borderRadius: 16,
      paddingHorizontal: 16,
      borderWidth: 2,
    },
    card: {
      borderRadius: 16,
      padding: 16,
    },
    modal: {
      borderRadius: 24,
      padding: 24,
    },
  },

  // Animation values
  animation: {
    timing: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    spring: {
      tension: 50,
      friction: 8,
    },
  },
};

// Theme Context
const ThemeContext = createContext(ProSwipeTheme);

// Theme Provider Component
export const ProSwipeThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={ProSwipeTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
export const useProSwipeTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useProSwipeTheme must be used within ProSwipeThemeProvider');
  }
  return theme;
};

// Themed Container Component
export const ThemedContainer = ({ 
  children, 
  variant = 'default', 
  safe = false, 
  centered = false,
  style,
  ...props 
}) => {
  const theme = useProSwipeTheme();
  
  const getContainerStyle = () => {
    const baseStyle = {
      flex: 1,
      backgroundColor: theme.colors.background,
    };
    
    if (safe) {
      baseStyle.paddingHorizontal = theme.spacing.lg;
    }
    
    if (centered) {
      baseStyle.justifyContent = 'center';
      baseStyle.alignItems = 'center';
    }
    
    return baseStyle;
  };
  
  if (variant === 'gradient') {
    return (
      <LinearGradient 
        colors={theme.gradients.background} 
        style={[getContainerStyle(), style]}
        {...props}
      >
        {children}
      </LinearGradient>
    );
  }
  
  return (
    <View style={[getContainerStyle(), style]} {...props}>
      {children}
    </View>
  );
};

// Themed Text Component
export const ThemedText = ({ 
  variant = 'body', 
  color, 
  children, 
  style, 
  ...props 
}) => {
  const theme = useProSwipeTheme();
  
  const getTextStyle = () => {
    const styles = {
      display: {
        fontSize: theme.typography.fontSize.display,
        fontWeight: theme.typography.fontWeight.extrabold,
        color: theme.colors.text,
        lineHeight: theme.typography.fontSize.display * theme.typography.lineHeight.tight,
      },
      heading: {
        fontSize: theme.typography.fontSize.xxl,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text,
        lineHeight: theme.typography.fontSize.xxl * theme.typography.lineHeight.tight,
      },
      subheading: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.semibold,
        color: theme.colors.text,
        lineHeight: theme.typography.fontSize.lg * theme.typography.lineHeight.normal,
      },
      body: {
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.normal,
        color: theme.colors.text,
        lineHeight: theme.typography.fontSize.md * theme.typography.lineHeight.normal,
      },
      bodySecondary: {
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.normal,
        color: theme.colors.textSecondary,
        lineHeight: theme.typography.fontSize.md * theme.typography.lineHeight.normal,
      },
      caption: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.normal,
        color: theme.colors.textTertiary,
        lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
      },
    };
    
    const baseStyle = styles[variant] || styles.body;
    
    if (color && theme.colors[color]) {
      baseStyle.color = theme.colors[color];
    } else if (color) {
      baseStyle.color = color;
    }
    
    return baseStyle;
  };
  
  return (
    <Text style={[getTextStyle(), style]} {...props}>
      {children}
    </Text>
  );
};

// Themed Button Component
export const ThemedButton = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  loading = false, 
  disabled = false, 
  icon, 
  iconPosition = 'left',
  style,
  textStyle,
  children,
  ...props 
}) => {
  const theme = useProSwipeTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    if (!disabled && !loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.7,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [disabled, loading]);

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const getButtonConfig = () => {
    const configs = {
      primary: {
        gradient: theme.gradients.button,
        textColor: theme.colors.textLight,
        shadow: theme.shadows.medium,
      },
      secondary: {
        gradient: theme.gradients.buttonSecondary,
        textColor: theme.colors.textLight,
        shadow: theme.shadows.medium,
      },
      success: {
        gradient: theme.gradients.buttonSuccess,
        textColor: theme.colors.textLight,
        shadow: theme.shadows.medium,
      },
      outline: {
        gradient: ['transparent', 'transparent'],
        textColor: theme.colors.primary,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        shadow: theme.shadows.small,
      },
      ghost: {
        gradient: ['transparent', 'transparent'],
        textColor: theme.colors.primary,
        shadow: theme.shadows.none,
      },
    };
    return configs[variant] || configs.primary;
  };

  const getSizeConfig = () => {
    const sizes = {
      small: {
        height: 40,
        paddingHorizontal: theme.spacing.md,
        fontSize: theme.typography.fontSize.sm,
      },
      medium: {
        height: theme.components.button.height,
        paddingHorizontal: theme.components.button.paddingHorizontal,
        fontSize: theme.typography.fontSize.md,
      },
      large: {
        height: 64,
        paddingHorizontal: theme.spacing.xl,
        fontSize: theme.typography.fontSize.lg,
      },
    };
    return sizes[size] || sizes.medium;
  };

  const buttonConfig = getButtonConfig();
  const sizeConfig = getSizeConfig();

  const renderContent = () => {
    const iconElement = icon && (
      <Ionicons 
        name={icon} 
        size={20} 
        color={buttonConfig.textColor}
        style={{ 
          marginRight: iconPosition === 'left' ? theme.spacing.sm : 0,
          marginLeft: iconPosition === 'right' ? theme.spacing.sm : 0,
        }} 
      />
    );

    const textElement = (title || children) && (
      <Text style={[
        {
          color: buttonConfig.textColor,
          fontSize: sizeConfig.fontSize,
          fontWeight: theme.typography.fontWeight.bold,
          textAlign: 'center',
        },
        textStyle,
      ]}>
        {title || children}
      </Text>
    );

    const loadingElement = loading && (
      <ActivityIndicator 
        size="small" 
        color={buttonConfig.textColor}
        style={{ marginRight: theme.spacing.sm }}
      />
    );

    return (
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: sizeConfig.height,
      }}>
        {loading && loadingElement}
        {!loading && iconPosition === 'left' && iconElement}
        {textElement}
        {!loading && iconPosition === 'right' && iconElement}
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        {
          borderRadius: theme.borderRadius.lg,
          overflow: 'hidden',
          marginVertical: theme.spacing.sm,
          transform: [{ scale: scaleAnim }],
          opacity: disabled ? 0.6 : glowAnim,
          borderWidth: buttonConfig.borderWidth || 0,
          borderColor: buttonConfig.borderColor,
          ...buttonConfig.shadow,
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
        {...props}
      >
        <LinearGradient 
          colors={buttonConfig.gradient} 
          style={{ 
            paddingVertical: theme.spacing.md,
            paddingHorizontal: sizeConfig.paddingHorizontal,
            minHeight: sizeConfig.height,
            justifyContent: 'center',
          }}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Themed Input Component
export const ThemedInput = ({ 
  placeholder, 
  value, 
  onChangeText, 
  icon, 
  iconPosition = 'left',
  secureTextEntry, 
  keyboardType, 
  error,
  variant = 'floating',
  multiline = false,
  style,
  ...props 
}) => {
  const theme = useProSwipeTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderColorAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedIsFocused, {
        toValue: (isFocused || value) ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderColorAnim, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isFocused, value]);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(scaleAnim, {
      toValue: 1.02,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [error ? theme.colors.error : theme.colors.border, theme.colors.borderFocus],
  });

  if (variant === 'floating') {
    const labelStyle = {
      position: 'absolute',
      left: iconPosition === 'left' && icon ? 48 : 16,
      top: animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, -8],
      }),
      fontSize: animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [16, 12],
      }),
      color: borderColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.textSecondary, theme.colors.primary],
      }),
      backgroundColor: theme.colors.background,
      paddingHorizontal: 4,
      zIndex: 1,
    };

    return (
      <View style={{ marginBottom: theme.spacing.lg }}>
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
          }}
        >
          <Animated.Text style={labelStyle}>
            {placeholder}
          </Animated.Text>
          
          <Animated.View
            style={[
              {
                flexDirection: 'row',
                alignItems: multiline ? 'flex-start' : 'center',
                borderWidth: 2,
                borderColor: borderColor,
                borderRadius: theme.borderRadius.lg,
                backgroundColor: theme.colors.input,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: multiline ? theme.spacing.md : theme.spacing.sm,
                minHeight: multiline ? 100 : theme.components.input.height,
                ...theme.shadows.small,
              },
              style,
            ]}
          >
            {iconPosition === 'left' && icon && (
              <Ionicons
                name={icon}
                size={20}
                color={isFocused ? theme.colors.primary : theme.colors.textSecondary}
                style={{ marginRight: theme.spacing.sm, marginTop: multiline ? 4 : 0 }}
              />
            )}
            
            <TextInput
              style={{
                flex: 1,
                fontSize: theme.typography.fontSize.md,
                color: theme.colors.text,
                paddingTop: multiline ? 4 : 20,
                paddingBottom: multiline ? 4 : 8,
                textAlignVertical: multiline ? 'top' : 'center',
              }}
              value={value}
              onChangeText={onChangeText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              secureTextEntry={secureTextEntry && !showPassword}
              keyboardType={keyboardType}
              placeholderTextColor="transparent"
              multiline={multiline}
              {...props}
            />
            
            {iconPosition === 'right' && icon && !secureTextEntry && (
              <Ionicons
                name={icon}
                size={20}
                color={isFocused ? theme.colors.primary : theme.colors.textSecondary}
                style={{ marginLeft: theme.spacing.sm }}
              />
            )}
            
            {secureTextEntry && (
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ padding: 4, marginLeft: theme.spacing.sm }}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </Animated.View>
        </Animated.View>
        
        {error && (
          <Animated.View
            style={{
              marginTop: theme.spacing.sm,
              marginLeft: theme.spacing.md,
            }}
          >
            <Text style={{
              color: theme.colors.error,
              fontSize: theme.typography.fontSize.xs,
              fontWeight: theme.typography.fontWeight.medium,
            }}>
              {error}
            </Text>
          </Animated.View>
        )}
      </View>
    );
  }

  // Standard input variant
  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      {placeholder && (
        <Text style={{
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.text,
          marginBottom: theme.spacing.sm,
        }}>
          {placeholder}
        </Text>
      )}
      
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: error ? theme.colors.error : (isFocused ? theme.colors.borderFocus : theme.colors.border),
            borderRadius: theme.borderRadius.lg,
            backgroundColor: theme.colors.input,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            minHeight: theme.components.input.height,
            ...theme.shadows.small,
          },
          style,
        ]}
      >
        {iconPosition === 'left' && icon && (
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? theme.colors.primary : theme.colors.textSecondary}
            style={{ marginRight: theme.spacing.sm }}
          />
        )}
        
        <TextInput
          style={{
            flex: 1,
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.text,
          }}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          placeholderTextColor={theme.colors.textTertiary}
          multiline={multiline}
          {...props}
        />
        
        {iconPosition === 'right' && icon && !secureTextEntry && (
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? theme.colors.primary : theme.colors.textSecondary}
            style={{ marginLeft: theme.spacing.sm }}
          />
        )}
        
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ padding: 4, marginLeft: theme.spacing.sm }}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={{
          color: theme.colors.error,
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.medium,
          marginTop: theme.spacing.sm,
          marginLeft: theme.spacing.md,
        }}>
          {error}
        </Text>
      )}
    </View>
  );
};

// Themed Card Component
export const ThemedCard = ({ 
  children, 
  variant = 'default',
  elevated = false,
  padding = true,
  style,
  ...props 
}) => {
  const theme = useProSwipeTheme();
  
  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      ...(elevated ? theme.shadows.large : theme.shadows.medium),
    };
    
    if (padding) {
      baseStyle.padding = theme.spacing.lg;
    }
    
    if (variant === 'gradient') {
      return {
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        ...(elevated ? theme.shadows.large : theme.shadows.medium),
      };
    }
    
    return baseStyle;
  };
  
  if (variant === 'gradient') {
    return (
      <View style={[getCardStyle(), style]} {...props}>
        <LinearGradient
          colors={theme.gradients.cardElevated}
          style={{ 
            flex: 1,
            padding: padding ? theme.spacing.lg : 0,
          }}
        >
          {children}
        </LinearGradient>
      </View>
    );
  }
  
  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
};

// Themed Loading Component
export const ThemedLoading = ({ 
  size = 'large', 
  color, 
  style,
  text,
  ...props 
}) => {
  const theme = useProSwipeTheme();
  
  return (
    <View style={[
      { 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: theme.spacing.xl,
      }, 
      style
    ]}>
      <ActivityIndicator 
        size={size} 
        color={color || theme.colors.primary} 
        {...props} 
      />
      {text && (
        <ThemedText 
          variant="bodySecondary" 
          style={{ marginTop: theme.spacing.md, textAlign: 'center' }}
        >
          {text}
        </ThemedText>
      )}
    </View>
  );
};

// All exports are already handled above where each component/function is defined