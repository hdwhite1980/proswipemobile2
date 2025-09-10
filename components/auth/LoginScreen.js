// components/auth/LoginScreen.js - Enhanced with Role Selection
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Modal,
  TextInput,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import services
import { AuthService } from '../../services/AuthService';
import { BiometricService } from '../../services/BiometricService';
import { SecurityService } from '../../services/SecurityService';
import { apiClient } from '../../services/ApiService';

// Import components
import { EnhancedButton, EnhancedInput } from '../common';

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Logo loading logic
let localLogo = null;
try {
  localLogo = require('../../assets/images/proswipe-logo.png');
} catch (error) {
  console.log('Logo not found, using fallback');
}

// ProSwipe brand theme
const theme = {
  colors: {
    primary: '#FF6B35', // Primary Orange
    primaryLight: '#FF8A65',
    primaryDark: '#FF5722', // Secondary Orange
    secondary: '#007AFF', // Blue
    accent: '#FFD700', // Gold
    success: '#32D74B', // Green
    background: '#FFFFFF', // Pure white
    backgroundSecondary: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    error: '#EF4444',
    warning: '#F59E0B',
    border: '#E5E7EB',
    borderFocus: '#FF6B35',
    overlay: 'rgba(0, 0, 0, 0.1)',
    shadow: 'rgba(255, 107, 53, 0.1)',
  },
  gradients: {
    primary: ['#FF6B35', '#FF5722', '#FFA500'], // Orange gradients
    secondary: ['#007AFF', '#0051D5'], // Blue gradients
    background: ['#FFFFFF', '#F8FAFC'], // White background
    card: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)'],
    button: ['#FF6B35', '#FF5722'], // Orange button gradient
    warm: ['#FFD700', '#FFA500', '#FF9F0A'], // Gold to orange
    dual: ['#FF6B35', '#007AFF'], // Orange to blue for dual users
  },
  spacing: {
    xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
  },
  borderRadius: {
    sm: 12, md: 16, lg: 24, xl: 32,
  },
  shadows: {
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
  },
};

// Floating particles background animation
const FloatingParticles = () => {
  const particles = useRef([...Array(8)].map(() => ({
    animValue: new Animated.Value(0),
    x: Math.random() * screenWidth,
    y: Math.random() * screenHeight,
    size: Math.random() * 60 + 40,
    color: Math.random() > 0.5 ? theme.colors.primary : theme.colors.secondary,
  }))).current;

  useEffect(() => {
    const animations = particles.map((particle) => 
      Animated.loop(
        Animated.sequence([
          Animated.timing(particle.animValue, {
            toValue: 1,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(particle.animValue, {
            toValue: 0,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ])
      )
    );

    animations.forEach(anim => anim.start());

    return () => animations.forEach(anim => anim.stop());
  }, []);

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            borderRadius: particle.size / 2,
            backgroundColor: particle.color,
            opacity: particle.animValue.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.1, 0.3, 0.1],
            }),
            transform: [{
              scale: particle.animValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.5, 1, 0.5],
              }),
            }],
          }}
        />
      ))}
    </View>
  );
};

// Friendly animated logo with pulse effect
const FriendlyLogo = ({ size = 120, style }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Gentle pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Subtle rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    // Glow effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        {
          width: size + 40,
          height: size + 40,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{ scale: pulseAnim }],
        },
        style,
      ]}
    >
      {/* Animated glow rings */}
      <Animated.View
        style={{
          position: 'absolute',
          width: size + 30,
          height: size + 30,
          borderRadius: (size + 30) / 2,
          borderWidth: 2,
          borderColor: theme.colors.primary,
          opacity: glowAnim,
          transform: [{ rotate }],
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          width: size + 60,
          height: size + 60,
          borderRadius: (size + 60) / 2,
          borderWidth: 1,
          borderColor: theme.colors.secondary,
          opacity: glowAnim.interpolate({
            inputRange: [0.3, 0.8],
            outputRange: [0.1, 0.3],
          }),
          transform: [{ rotate: rotateAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['360deg', '0deg'],
          }) }],
        }}
      />
      
      {/* Main logo container */}
      <LinearGradient
        colors={theme.gradients.primary}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          justifyContent: 'center',
          alignItems: 'center',
          ...theme.shadows.large,
        }}
      >
        {localLogo ? (
          <Image
            source={localLogo}
            style={{
              width: size - 20,
              height: size - 20,
              borderRadius: (size - 20) / 2,
            }}
            resizeMode="contain"
          />
        ) : (
          <Icon name="handyman" size={size / 2.5} color="#FFFFFF" />
        )}
      </LinearGradient>
    </Animated.View>
  );
};

// Modern floating input with smooth animations
const FloatingInput = ({ 
  placeholder, 
  value, 
  onChangeText, 
  icon, 
  secureTextEntry, 
  keyboardType, 
  error,
  ...props 
}) => {
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

  const labelStyle = {
    position: 'absolute',
    left: 16,
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

  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.border, theme.colors.borderFocus],
  });

  return (
    <View style={{ marginBottom: 20 }}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Animated.Text style={labelStyle}>
          {placeholder}
        </Animated.Text>
        
        <Animated.View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: borderColor,
            borderRadius: theme.borderRadius.md,
            backgroundColor: theme.colors.surface,
            paddingHorizontal: 16,
            paddingVertical: 12,
            minHeight: 56,
            ...theme.shadows.small,
          }}
        >
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? theme.colors.primary : theme.colors.textSecondary}
            style={{ marginRight: 12 }}
          />
          
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              color: theme.colors.text,
              paddingVertical: 4,
            }}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={secureTextEntry && !showPassword}
            keyboardType={keyboardType}
            placeholderTextColor="transparent"
            {...props}
          />
          
          {secureTextEntry && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{ padding: 4 }}
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
            marginTop: 8,
            marginLeft: 16,
            opacity: 1,
          }}
        >
          <Text style={{
            color: theme.colors.error,
            fontSize: 12,
            fontWeight: '500',
          }}>
            ⚠️ {error}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

// Bouncy button with haptic feedback
const BouncyButton = ({ 
  title, 
  onPress, 
  loading, 
  disabled, 
  variant = 'primary', 
  icon, 
  style 
}) => {
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

  const gradientColors = variant === 'secondary' 
    ? theme.gradients.secondary 
    : variant === 'dual'
    ? theme.gradients.dual
    : theme.gradients.button;

  return (
    <Animated.View
      style={[
        {
          borderRadius: theme.borderRadius.md,
          overflow: 'hidden',
          marginVertical: 8,
          transform: [{ scale: scaleAnim }],
          opacity: glowAnim,
          ...theme.shadows.medium,
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
      >
        <LinearGradient 
          colors={gradientColors} 
          style={{ 
            paddingVertical: 18, 
            paddingHorizontal: 24,
            minHeight: 56,
            justifyContent: 'center',
          }}
        >
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            {loading && (
              <Animated.View style={{ marginRight: 8 }}>
                <Ionicons name="refresh" size={20} color="#FFFFFF" />
              </Animated.View>
            )}
            {icon && !loading && (
              <Ionicons 
                name={icon} 
                size={20} 
                color="#FFFFFF" 
                style={{ marginRight: 8 }} 
              />
            )}
            <Text style={{
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: '700',
              textAlign: 'center',
            }}>
              {loading ? 'Please wait...' : title}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Enhanced User Type Selector for signup with both options
const EnhancedUserTypeSelector = ({ userType, setUserType, allowDual = false }) => {
  const scaleAnims = useRef({
    homeowner: new Animated.Value(1),
    contractor: new Animated.Value(1),
    both: new Animated.Value(1),
  }).current;

  const handleSelect = (type) => {
    setUserType(type);
    
    // Animate selected card
    Animated.sequence([
      Animated.timing(scaleAnims[type], {
        toValue: 1.05,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[type], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const userTypes = [
    { 
      key: 'homeowner', 
      label: 'Homeowner', 
      icon: 'home-outline',
      description: 'Find trusted professionals',
      gradient: ['#FF6B35', '#FF5722'],
    },
    { 
      key: 'contractor', 
      label: 'Professional', 
      icon: 'construct-outline',
      description: 'Grow your business',
      gradient: ['#007AFF', '#0051D5'],
    },
    ...(allowDual ? [{ 
      key: 'both', 
      label: 'Both', 
      icon: 'swap-horizontal-outline',
      description: 'Access both features',
      gradient: ['#FF6B35', '#007AFF'],
    }] : []),
  ];

  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 16,
        textAlign: 'center',
      }}>
        I am a:
      </Text>
      
      <View style={{ 
        flexDirection: allowDual ? 'column' : 'row', 
        gap: 12 
      }}>
        {userTypes.map((type) => (
          <Animated.View
            key={type.key}
            style={{
              flex: allowDual ? 0 : 1,
              transform: [{ scale: scaleAnims[type.key] }],
            }}
          >
            <TouchableOpacity
              style={{
                borderRadius: theme.borderRadius.lg,
                overflow: 'hidden',
                borderWidth: 3,
                borderColor: userType === type.key 
                  ? theme.colors.primary 
                  : theme.colors.border,
                ...theme.shadows.small,
              }}
              onPress={() => handleSelect(type.key)}
            >
              <LinearGradient
                colors={userType === type.key 
                  ? type.gradient 
                  : [theme.colors.surface, theme.colors.surface]
                }
                style={{ 
                  padding: 20, 
                  alignItems: 'center',
                  flexDirection: allowDual ? 'row' : 'column'
                }}
              >
                <View style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: userType === type.key 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : theme.colors.backgroundSecondary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: allowDual ? 0 : 12,
                  marginRight: allowDual ? 16 : 0,
                }}>
                  <Ionicons
                    name={type.icon}
                    size={24}
                    color={userType === type.key 
                      ? '#FFFFFF' 
                      : theme.colors.primary
                    }
                  />
                </View>
                
                <View style={{ flex: allowDual ? 1 : 0 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: userType === type.key 
                      ? '#FFFFFF' 
                      : theme.colors.text,
                    marginBottom: 4,
                    textAlign: allowDual ? 'left' : 'center',
                  }}>
                    {type.label}
                  </Text>
                  
                  <Text style={{
                    fontSize: 12,
                    color: userType === type.key 
                      ? 'rgba(255, 255, 255, 0.8)' 
                      : theme.colors.textSecondary,
                    textAlign: allowDual ? 'left' : 'center',
                    lineHeight: 16,
                  }}>
                    {type.description}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

// NEW: Role Selection Tabs for dual users during login
const RoleSelectionTabs = ({ userCapabilities, selectedRole, onRoleSelect, disabled }) => {
  if (!userCapabilities || !(userCapabilities.is_homeowner && userCapabilities.is_contractor)) {
    return null; // Only show for dual users
  }

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 12,
        textAlign: 'center',
      }}>
        Sign in as:
      </Text>
      
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {/* Homeowner Option */}
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            backgroundColor: selectedRole === 'homeowner' 
              ? theme.colors.primary + '20' 
              : theme.colors.surface,
            borderRadius: theme.borderRadius.md,
            borderWidth: 2,
            borderColor: selectedRole === 'homeowner' 
              ? theme.colors.primary 
              : theme.colors.border,
            ...theme.shadows.small,
          }}
          onPress={() => !disabled && onRoleSelect('homeowner')}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <View style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: selectedRole === 'homeowner' ? theme.colors.primary : theme.colors.border,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}>
            <Ionicons
              name="home"
              size={18}
              color={selectedRole === 'homeowner' ? '#FFFFFF' : theme.colors.textSecondary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '700',
              color: selectedRole === 'homeowner' ? theme.colors.primary : theme.colors.text,
              marginBottom: 2,
            }}>
              Homeowner
            </Text>
            <Text style={{
              fontSize: 12,
              color: selectedRole === 'homeowner' ? theme.colors.primary : theme.colors.textSecondary,
            }}>
              Find professionals
            </Text>
          </View>
        </TouchableOpacity>

        {/* Contractor Option */}
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            backgroundColor: selectedRole === 'contractor' 
              ? theme.colors.secondary + '20' 
              : theme.colors.surface,
            borderRadius: theme.borderRadius.md,
            borderWidth: 2,
            borderColor: selectedRole === 'contractor' 
              ? theme.colors.secondary 
              : theme.colors.border,
            ...theme.shadows.small,
          }}
          onPress={() => !disabled && onRoleSelect('contractor')}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <View style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: selectedRole === 'contractor' ? theme.colors.secondary : theme.colors.border,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}>
            <Ionicons
              name="construct"
              size={18}
              color={selectedRole === 'contractor' ? '#FFFFFF' : theme.colors.textSecondary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '700',
              color: selectedRole === 'contractor' ? theme.colors.secondary : theme.colors.text,
              marginBottom: 2,
            }}>
              Professional
            </Text>
            <Text style={{
              fontSize: 12,
              color: selectedRole === 'contractor' ? theme.colors.secondary : theme.colors.textSecondary,
            }}>
              Find work
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Enhanced signup modal for existing users
const AccountTypeSignupModal = ({ visible, userCapabilities, onSignup, onCancel, loading }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [errors, setErrors] = useState({});
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const missingType = userCapabilities?.is_homeowner ? 'contractor' : 'homeowner';
  const isContractorSignup = missingType === 'contractor';

  useEffect(() => {
    if (visible) {
      // Reset form
      setFullName('');
      setPhone('');
      setCompanyName('');
      setLicenseNumber('');
      setErrors({});
      
      Animated.spring(bounceAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    
    if (isContractorSignup) {
      if (!companyName.trim()) newErrors.companyName = 'Company name is required';
      // License number is optional but validate format if provided
      if (licenseNumber.trim() && licenseNumber.length < 3) {
        newErrors.licenseNumber = 'License number must be at least 3 characters';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
    if (!validateForm()) return;
    
    const signupData = {
      type: missingType,
      fullName: fullName.trim(),
      phone: phone.trim(),
      ...(isContractorSignup && {
        companyName: companyName.trim(),
        licenseNumber: licenseNumber.trim() || null,
      }),
    };
    
    onSignup(signupData);
  };

  if (!visible || !userCapabilities) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}>
        <Animated.View
          style={{
            transform: [{ scale: bounceAnim }],
            width: '100%',
            maxWidth: 450,
            maxHeight: '85%',
          }}
        >
          <LinearGradient
            colors={[theme.colors.surface, theme.colors.backgroundSecondary]}
            style={{
              borderRadius: theme.borderRadius.xl,
              padding: 24,
              ...theme.shadows.large,
            }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <View style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: isContractorSignup ? theme.colors.secondary : theme.colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 16,
                  ...theme.shadows.medium,
                }}>
                  <Ionicons 
                    name={isContractorSignup ? "construct" : "home"} 
                    size={40} 
                    color="#FFFFFF" 
                  />
                </View>
                
                <Text style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: theme.colors.text,
                  marginBottom: 8,
                  textAlign: 'center',
                }}>
                  Enable {isContractorSignup ? 'Professional' : 'Homeowner'} Access
                </Text>
                
                <Text style={{
                  fontSize: 16,
                  color: theme.colors.textSecondary,
                  textAlign: 'center',
                  lineHeight: 22,
                  paddingHorizontal: 8,
                }}>
                  {isContractorSignup 
                    ? 'Complete your professional profile to start finding work and growing your business'
                    : 'Add homeowner access to find and hire trusted professionals for your projects'
                  }
                </Text>
              </View>

              {/* Form Fields */}
              <View style={{ marginBottom: 20 }}>
                <FloatingInput
                  placeholder="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  icon="person-outline"
                  error={errors.fullName}
                />
                
                <FloatingInput
                  placeholder="Phone Number"
                  value={phone}
                  onChangeText={setPhone}
                  icon="call-outline"
                  keyboardType="phone-pad"
                  error={errors.phone}
                />

                {isContractorSignup && (
                  <>
                    <FloatingInput
                      placeholder="Company Name"
                      value={companyName}
                      onChangeText={setCompanyName}
                      icon="business-outline"
                      error={errors.companyName}
                    />
                    
                    <FloatingInput
                      placeholder="License Number (Optional)"
                      value={licenseNumber}
                      onChangeText={setLicenseNumber}
                      icon="document-text-outline"
                      error={errors.licenseNumber}
                    />
                  </>
                )}
              </View>

              {/* Benefits Section */}
              <View style={{
                backgroundColor: theme.colors.backgroundSecondary,
                borderRadius: theme.borderRadius.md,
                padding: 16,
                marginBottom: 24,
                borderLeftWidth: 4,
                borderLeftColor: isContractorSignup ? theme.colors.secondary : theme.colors.primary,
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: theme.colors.text,
                  marginBottom: 12,
                }}>
                  What you'll get:
                </Text>
                
                {isContractorSignup ? (
                  <View style={{ gap: 8 }}>
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>
                      • Find local jobs that match your skills
                    </Text>
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>
                      • Build your reputation with reviews
                    </Text>
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>
                      • Grow your customer base
                    </Text>
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>
                      • Switch between both modes anytime
                    </Text>
                  </View>
                ) : (
                  <View style={{ gap: 8 }}>
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>
                      • Find trusted local professionals
                    </Text>
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>
                      • Get quotes for your projects
                    </Text>
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>
                      • Read verified reviews
                    </Text>
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>
                      • Switch between both modes anytime
                    </Text>
                  </View>
                )}
              </View>

              {/* Action Buttons */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <BouncyButton
                  title="Cancel"
                  onPress={onCancel}
                  variant="secondary"
                  style={{ flex: 1 }}
                />
                <BouncyButton
                  title={`Enable ${isContractorSignup ? 'Professional' : 'Homeowner'}`}
                  onPress={handleSignup}
                  loading={loading}
                  disabled={loading}
                  icon={isContractorSignup ? "construct-outline" : "home-outline"}
                  variant={isContractorSignup ? "secondary" : "primary"}
                  style={{ flex: 2 }}
                />
              </View>
            </ScrollView>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ENHANCED: User Capabilities Display with Role Selection and Signup
const UserCapabilitiesDisplay = ({ 
  userCapabilities, 
  selectedRole,
  onRoleSelect,
  onSwitchMode, 
  onEnableMode,
  onShowSignup, 
  loading 
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (userCapabilities) {
      setIsVisible(true);
      Animated.spring(slideAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [userCapabilities]);

  if (!isVisible || !userCapabilities) {
    return null;
  }

  const isDualUser = userCapabilities.is_homeowner && userCapabilities.is_contractor;
  const currentMode = userCapabilities.active_user_type;
  const missingType = userCapabilities.is_homeowner ? 'contractor' : 'homeowner';

  return (
    <Animated.View
      style={{
        marginBottom: 24,
        transform: [{ 
          translateY: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          })
        }],
        opacity: slideAnim,
      }}
    >
      <View style={{
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.lg,
        padding: 16,
        borderWidth: 2,
        borderColor: theme.colors.border,
        ...theme.shadows.small,
      }}>
        {/* NEW: Role Selection for Login */}
        {isDualUser && (
          <RoleSelectionTabs
            userCapabilities={userCapabilities}
            selectedRole={selectedRole}
            onRoleSelect={onRoleSelect}
            disabled={loading}
          />
        )}

        {/* ENHANCED: Single User Display with prominent signup option */}
        {!isDualUser && (
          <View style={{ marginBottom: 16 }}>
            {/* Current Account Type */}
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 12,
                backgroundColor: theme.colors.surface,
                borderRadius: theme.borderRadius.md,
                borderWidth: 1,
                borderColor: userCapabilities.is_homeowner ? theme.colors.primary : theme.colors.secondary,
              }}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: userCapabilities.is_homeowner ? theme.colors.primary : theme.colors.secondary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}>
                  <Ionicons
                    name={userCapabilities.is_homeowner ? "home" : "construct"}
                    size={20}
                    color="#FFFFFF"
                  />
                </View>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: theme.colors.text,
                }}>
                  {userCapabilities.is_homeowner ? 'Homeowner Account' : 'Professional Account'}
                </Text>
              </View>
            </View>

            {/* Prominent Missing Account Type Card */}
            <View style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.md,
              borderWidth: 2,
              borderColor: missingType === 'contractor' ? theme.colors.secondary : theme.colors.primary,
              borderStyle: 'dashed',
              padding: 16,
              alignItems: 'center',
            }}>
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: `${missingType === 'contractor' ? theme.colors.secondary : theme.colors.primary}20`,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 12,
              }}>
                <Ionicons
                  name={missingType === 'contractor' ? "construct-outline" : "home-outline"}
                  size={24}
                  color={missingType === 'contractor' ? theme.colors.secondary : theme.colors.primary}
                />
              </View>
              
              <Text style={{
                fontSize: 16,
                fontWeight: '700',
                color: theme.colors.text,
                marginBottom: 4,
                textAlign: 'center',
              }}>
                Add {missingType === 'contractor' ? 'Professional' : 'Homeowner'} Access
              </Text>
              
              <Text style={{
                fontSize: 14,
                color: theme.colors.textSecondary,
                marginBottom: 16,
                textAlign: 'center',
                lineHeight: 20,
              }}>
                {missingType === 'contractor' 
                  ? 'Start finding work and growing your business'
                  : 'Find trusted professionals for your projects'
                }
              </Text>

              <BouncyButton
                title={`Become a ${missingType === 'contractor' ? 'Professional' : 'Homeowner'}`}
                onPress={() => onShowSignup(missingType)}
                variant={missingType === 'contractor' ? 'secondary' : 'primary'}
                icon={missingType === 'contractor' ? "construct-outline" : "home-outline"}
                disabled={loading}
                style={{ minWidth: 200 }}
              />
            </View>
          </View>
        )}

        {/* Existing capability cards (keep existing logic for dual users) */}
        {isDualUser && (
          <>
            {/* Header */}
            <View style={{ marginBottom: 16, alignItems: 'center' }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '700',
                color: theme.colors.text,
                marginBottom: 4,
              }}>
                Dual Access Account
              </Text>
              <Text style={{
                fontSize: 14,
                color: theme.colors.textSecondary,
              }}>
                Currently: {currentMode === 'homeowner' ? 'Homeowner' : 'Professional'} Mode
              </Text>
            </View>

            {/* Capability Cards */}
            <View style={{ gap: 12, marginBottom: 16 }}>
              {/* Homeowner Card */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 12,
                backgroundColor: userCapabilities.is_homeowner 
                  ? (currentMode === 'homeowner' ? theme.colors.primary + '20' : theme.colors.surface)
                  : theme.colors.backgroundSecondary,
                borderRadius: theme.borderRadius.md,
                borderWidth: 1,
                borderColor: userCapabilities.is_homeowner && currentMode === 'homeowner' 
                  ? theme.colors.primary 
                  : theme.colors.border,
              }}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: userCapabilities.is_homeowner ? theme.colors.primary : theme.colors.border,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}>
                  <Ionicons
                    name="home-outline"
                    size={20}
                    color={userCapabilities.is_homeowner ? '#FFFFFF' : theme.colors.textSecondary}
                  />
                </View>
                
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: theme.colors.text,
                  }}>
                    Homeowner Access
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: theme.colors.textSecondary,
                  }}>
                    {userCapabilities.is_homeowner ? 'Enabled' : 'Not available'}
                  </Text>
                </View>

                {userCapabilities.is_homeowner ? (
                  currentMode !== 'homeowner' && (
                    <TouchableOpacity
                      onPress={() => onSwitchMode('homeowner')}
                      disabled={loading}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        backgroundColor: theme.colors.primary,
                        borderRadius: theme.borderRadius.sm,
                      }}
                    >
                      <Text style={{
                        color: '#FFFFFF',
                        fontSize: 12,
                        fontWeight: '600',
                      }}>
                        {loading ? 'Switching...' : 'Switch'}
                      </Text>
                    </TouchableOpacity>
                  )
                ) : (
                  <TouchableOpacity
                    onPress={() => onEnableMode('homeowner')}
                    disabled={loading}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      backgroundColor: theme.colors.secondary,
                      borderRadius: theme.borderRadius.sm,
                    }}
                  >
                    <Text style={{
                      color: '#FFFFFF',
                      fontSize: 12,
                      fontWeight: '600',
                    }}>
                      Enable
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Contractor Card */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 12,
                backgroundColor: userCapabilities.is_contractor 
                  ? (currentMode === 'contractor' ? theme.colors.secondary + '20' : theme.colors.surface)
                  : theme.colors.backgroundSecondary,
                borderRadius: theme.borderRadius.md,
                borderWidth: 1,
                borderColor: userCapabilities.is_contractor && currentMode === 'contractor' 
                  ? theme.colors.secondary 
                  : theme.colors.border,
              }}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: userCapabilities.is_contractor ? theme.colors.secondary : theme.colors.border,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}>
                  <Ionicons
                    name="construct-outline"
                    size={20}
                    color={userCapabilities.is_contractor ? '#FFFFFF' : theme.colors.textSecondary}
                  />
                </View>
                
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: theme.colors.text,
                  }}>
                    Professional Access
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: theme.colors.textSecondary,
                  }}>
                    {userCapabilities.is_contractor ? 'Enabled' : 'Not available'}
                  </Text>
                </View>

                {userCapabilities.is_contractor ? (
                  currentMode !== 'contractor' && (
                    <TouchableOpacity
                      onPress={() => onSwitchMode('contractor')}
                      disabled={loading}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        backgroundColor: theme.colors.secondary,
                        borderRadius: theme.borderRadius.sm,
                      }}
                    >
                      <Text style={{
                        color: '#FFFFFF',
                        fontSize: 12,
                        fontWeight: '600',
                      }}>
                        {loading ? 'Switching...' : 'Switch'}
                      </Text>
                    </TouchableOpacity>
                  )
                ) : (
                  <TouchableOpacity
                    onPress={() => onEnableMode('contractor')}
                    disabled={loading}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      backgroundColor: theme.colors.primary,
                      borderRadius: theme.borderRadius.sm,
                    }}
                  >
                    <Text style={{
                      color: '#FFFFFF',
                      fontSize: 12,
                      fontWeight: '600',
                    }}>
                      Enable
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </>
        )}

        {/* Info Note */}
        <View style={{
          padding: 8,
          backgroundColor: theme.colors.warning + '20',
          borderRadius: theme.borderRadius.sm,
          borderLeftWidth: 4,
          borderLeftColor: theme.colors.warning,
        }}>
          <Text style={{
            fontSize: 12,
            color: theme.colors.textSecondary,
            lineHeight: 16,
          }}>
            ℹ️ Note: You cannot hire yourself or bid on your own jobs when switching between modes.
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

// Enhanced 2FA Modal with friendly design
const Friendly2FAModal = ({ visible, email, onVerify, onCancel, loading }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(bounceAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleCodeChange = (text) => {
    const numericCode = text.replace(/[^0-9]/g, '').slice(0, 6);
    setCode(numericCode);
    setError('');
  };

  const handleVerify = () => {
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    onVerify(code);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}>
        <Animated.View
          style={{
            transform: [{ scale: bounceAnim }],
            width: '100%',
            maxWidth: 400,
          }}
        >
          <LinearGradient
            colors={[theme.colors.surface, theme.colors.backgroundSecondary]}
            style={{
              borderRadius: theme.borderRadius.xl,
              padding: 32,
              alignItems: 'center',
              ...theme.shadows.large,
            }}
          >
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: theme.colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 24,
              ...theme.shadows.medium,
            }}>
              <Ionicons name="shield-checkmark-outline" size={40} color="#FFFFFF" />
            </View>
            
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: theme.colors.text,
              marginBottom: 8,
              textAlign: 'center',
            }}>
              Almost there!
            </Text>
            
            <Text style={{
              fontSize: 16,
              color: theme.colors.textSecondary,
              textAlign: 'center',
              marginBottom: 32,
              lineHeight: 22,
            }}>
              Enter the 6-digit code from your authenticator app to complete sign in
            </Text>

            <TextInput
              style={{
                backgroundColor: theme.colors.backgroundSecondary,
                borderWidth: 2,
                borderColor: code.length === 6 ? theme.colors.success : theme.colors.border,
                borderRadius: theme.borderRadius.md,
                paddingVertical: 20,
                paddingHorizontal: 24,
                fontSize: 28,
                fontWeight: '700',
                color: theme.colors.text,
                textAlign: 'center',
                letterSpacing: 12,
                width: '100%',
                marginBottom: 16,
                ...theme.shadows.small,
              }}
              value={code}
              onChangeText={handleCodeChange}
              placeholder="000000"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="numeric"
              maxLength={6}
              autoFocus
            />

            {error && (
              <Text style={{ 
                color: theme.colors.error, 
                marginBottom: 16,
                textAlign: 'center',
                fontSize: 14,
                fontWeight: '500',
              }}>
                ⚠️ {error}
              </Text>
            )}

            <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
              <BouncyButton
                title="Cancel"
                onPress={onCancel}
                variant="secondary"
                style={{ flex: 1 }}
              />
              <BouncyButton
                title="Verify"
                onPress={handleVerify}
                loading={loading}
                disabled={code.length !== 6}
                icon="checkmark-circle-outline"
                style={{ flex: 1 }}
              />
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Main LoginScreen Component
export default function LoginScreen({ navigation, onLogin, route }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState('homeowner');
  const [errors, setErrors] = useState({});

  // User capabilities state
  const [userCapabilities, setUserCapabilities] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null); // NEW: For role selection
  const [switchingMode, setSwitchingMode] = useState(false);
  const [enablingMode, setEnablingMode] = useState(false);
  
  // NEW: Account type signup state
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  // 2FA State
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [pendingSessionId, setPendingSessionId] = useState(null);
  const [verifying2FA, setVerifying2FA] = useState(false);

  // Biometric State
  const [biometricAvailable, setBiometricAvailable] = useState(null);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [biometricError, setBiometricError] = useState('');

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const initializeApp = async () => {
      await checkBiometricSetup();
      await loadLastEmail();
      
      // Check if we came from token expiration
      if (route?.params?.biometricAvailable && route?.params?.email) {
        console.log('🔐 Initializing from token expiration with biometric available');
        setEmail(route.params.email);
        setShowBiometricPrompt(true);
        setBiometricError('Your session expired. Sign in with biometrics or password.');
      }
      
      startAnimations();
    };
    
    initializeApp();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (email.trim().length > 0 && biometricAvailable !== null) {
        checkBiometricForCurrentEmail();
        loadUserCapabilities();
      } else {
        setShowBiometricPrompt(false);
        setBiometricError('');
        setUserCapabilities(null);
        setSelectedRole(null); // NEW: Reset role selection
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [email, biometricAvailable]);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const checkBiometricSetup = async () => {
    try {
      const biometric = await BiometricService.isAvailable();
      setBiometricAvailable(biometric.available);
      
      if (!biometric.available) {
        setBiometricError(biometric.reason || 'Biometric authentication is not available');
      } else {
        setBiometricError('');
      }
    } catch (error) {
      setBiometricAvailable(false);
      setBiometricError('Failed to check biometric availability');
    }
  };

  const loadLastEmail = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('last_login_email');
      if (savedEmail && savedEmail.trim() && !email) {
        setEmail(savedEmail);
      }
    } catch (error) {
      console.error('Error loading last email:', error);
    }
  };

  // ENHANCED: loadUserCapabilities with role auto-selection
  const loadUserCapabilities = async () => {
    if (!email.trim()) {
      setUserCapabilities(null);
      setSelectedRole(null); // NEW: Reset role selection
      return;
    }

    try {
      const response = await apiClient.get(`/auth/user-capabilities?email=${encodeURIComponent(email)}`);
      if (response.data.capabilities) {
        const capabilities = response.data.capabilities;
        setUserCapabilities(capabilities);
        
        // NEW: Auto-set selected role based on user capabilities
        if (capabilities.is_homeowner && capabilities.is_contractor) {
          // Dual user - default to their current active type
          setSelectedRole(capabilities.active_user_type || 'homeowner');
        } else if (capabilities.is_homeowner) {
          setSelectedRole('homeowner');
        } else if (capabilities.is_contractor) {
          setSelectedRole('contractor');
        } else {
          setSelectedRole(null);
        }
      } else {
        setUserCapabilities(null);
        setSelectedRole(null);
      }
    } catch (error) {
      console.log('Could not load user capabilities (user may not exist yet)');
      setUserCapabilities(null);
      setSelectedRole(null);
    }
  };

  const checkBiometricForCurrentEmail = async () => {
    try {
      if (!email.trim() || biometricAvailable !== true) {
        setShowBiometricPrompt(false);
        return;
      }

      const userHasBiometric = await BiometricService.checkUserBiometricSetting(email);
      const storedCredentials = await BiometricService.getStoredCredentials(email);
      
      if (userHasBiometric && storedCredentials) {
        setShowBiometricPrompt(true);
        setBiometricError('');
      } else {
        setShowBiometricPrompt(false);
        if (biometricAvailable === true) {
          setBiometricError('Sign in with your password to enable biometric authentication for next time');
        }
      }
    } catch (error) {
      setShowBiometricPrompt(false);
      setBiometricError(`Biometric check failed: ${error.message}`);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email';
    
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (isSignUp) {
      if (!fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!phone.trim()) newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ENHANCED: handleAuth with selected role
  const handleAuth = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      let response;
      if (isSignUp) {
        // Handle signup with dual type option
        const enableBothTypes = userType === 'both';
        const signupUserType = userType === 'both' ? 'homeowner' : userType;
        
        response = await AuthService.signUp(
          email, 
          password, 
          signupUserType, 
          fullName, 
          phone,
          enableBothTypes
        );
        
        Alert.alert('Welcome to ProSwipe!', 'Your account has been created successfully! Please sign in to continue.', [
          { text: 'Sign In Now', onPress: () => setIsSignUp(false) }
        ]);
      } else {
        // ENHANCED: Pass selected role to login
        response = await AuthService.login(
          email, 
          password, 
          biometricAvailable,
          selectedRole // NEW: Pass the selected role
        );
        
        if (response.requiresTwoFactor) {
          setPendingSessionId(response.pendingSessionId);
          setShow2FAModal(true);
          return;
        }
        
        if (response.success && response.session?.access_token) {
          await handleSuccessfulLogin(response);
        } else {
          throw new Error(response.error || 'Login failed');
        }
      }
    } catch (error) {
      Alert.alert('Oops!', error.message || 'Something went wrong. Please try again.');
    } finally {
      if (!show2FAModal) {
        setLoading(false);
      }
    }
  };

  const handleSuccessfulLogin = async (response) => {
    try {
      console.log('✅ Login successful, completing login process...');
      
      // Store additional user info
      await AsyncStorage.setItem('last_login_email', email);
      
      // Load fresh user capabilities
      await loadUserCapabilities();
      
      // Complete login
      onLogin(response.user, response.session.access_token);
      
    } catch (error) {
      console.error('Error in handleSuccessfulLogin:', error);
      // Still call onLogin even if some storage operations fail
      onLogin(response.user, response.session.access_token);
    }
  };

  const handleModeSwitch = async (newMode) => {
    if (!userCapabilities || !userCapabilities.id) {
      Alert.alert('Error', 'Cannot switch mode - user data not loaded');
      return;
    }

    setSwitchingMode(true);
    try {
      const response = await apiClient.post('/auth/switch-user-type', {
        userId: userCapabilities.id,
        newActiveType: newMode,
      });

      if (response.data.success) {
        setUserCapabilities(prev => ({
          ...prev,
          active_user_type: newMode,
        }));
        
        // Update stored user type
        await AsyncStorage.setItem('user_type', newMode);
        
        Alert.alert(
          'Switched Successfully!', 
          `You're now in ${newMode === 'homeowner' ? 'Homeowner' : 'Professional'} mode.`
        );
      } else {
        throw new Error(response.data.error || 'Failed to switch user type');
      }
    } catch (error) {
      Alert.alert('Switch Failed', error.message || 'Could not switch user type');
    } finally {
      setSwitchingMode(false);
    }
  };

  const handleModeEnable = async (modeToEnable) => {
    if (!userCapabilities || !userCapabilities.id) {
      Alert.alert('Error', 'Cannot enable mode - user data not loaded');
      return;
    }

    Alert.alert(
      `Enable ${modeToEnable === 'homeowner' ? 'Homeowner' : 'Professional'} Access`,
      `This will add ${modeToEnable} capabilities to your account. You'll be able to switch between both modes.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Enable', 
          onPress: async () => {
            setEnablingMode(true);
            try {
              const response = await apiClient.post('/auth/enable-user-type', {
                userId: userCapabilities.id,
                typeToEnable: modeToEnable,
                verified: true,
              });

              if (response.data.success) {
                // Reload capabilities
                await loadUserCapabilities();
                
                Alert.alert(
                  'Access Enabled!', 
                  `You now have ${modeToEnable} access. You can switch between modes anytime.`
                );
              } else {
                throw new Error(response.data.error || 'Failed to enable user type');
              }
            } catch (error) {
              Alert.alert('Enable Failed', error.message || 'Could not enable user type');
            } finally {
              setEnablingMode(false);
            }
          }
        }
      ]
    );
  };

  // NEW: Handle account type signup for existing users
  const handleShowSignup = (accountType) => {
    setShowSignupModal(true);
  };

  const handleAccountTypeSignup = async (signupData) => {
    if (!userCapabilities || !userCapabilities.id) {
      Alert.alert('Error', 'Cannot add account type - user data not loaded');
      return;
    }

    setSignupLoading(true);
    try {
      const response = await apiClient.post('/auth/add-account-type', {
        userId: userCapabilities.id,
        accountType: signupData.type,
        profileData: {
          fullName: signupData.fullName,
          phone: signupData.phone,
          ...(signupData.type === 'contractor' && {
            companyName: signupData.companyName,
            licenseNumber: signupData.licenseNumber,
          }),
        },
      });

      if (response.data.success) {
        setShowSignupModal(false);
        
        // Reload capabilities to reflect the new account type
        await loadUserCapabilities();
        
        Alert.alert(
          'Success!', 
          `Your ${signupData.type === 'contractor' ? 'professional' : 'homeowner'} account has been created! You can now switch between both modes.`,
          [
            { 
              text: 'Great!', 
              onPress: () => {
                // Auto-select the newly created role
                setSelectedRole(signupData.type);
              }
            }
          ]
        );
      } else {
        throw new Error(response.data.error || 'Failed to create account type');
      }
    } catch (error) {
      Alert.alert(
        'Signup Failed', 
        error.message || 'Could not create account type. Please try again.'
      );
    } finally {
      setSignupLoading(false);
    }
  };

  const handleSignupCancel = () => {
    setShowSignupModal(false);
  };

  const handle2FAVerification = async (code) => {
    setVerifying2FA(true);
    try {
      const response = await AuthService.verify2FA(email, code, pendingSessionId);
      
      if (response.session?.access_token) {
        setShow2FAModal(false);
        setPendingSessionId(null);
        
        // Store tokens
        await AsyncStorage.setItem('access_token', response.session.access_token);
        if (response.session.refresh_token) {
          await AsyncStorage.setItem('refresh_token', response.session.refresh_token);
        }
        await AsyncStorage.setItem('last_login_email', email);
        await AsyncStorage.setItem('user_type', response.user.userType || 'homeowner');
        
        // Store biometric credentials if available
        if (biometricAvailable === true) {
          try {
            await BiometricService.storeCredentials(
              email, 
              response.user, 
              response.session.access_token, 
              password
            );
          } catch (biometricError) {
            console.error('Failed to store biometric credentials:', biometricError);
          }
        }
        
        await handleSuccessfulLogin({ user: response.user, session: response.session });
      }
    } catch (error) {
      Alert.alert('Verification Failed', error.message || 'Invalid verification code. Please try again.');
    } finally {
      setVerifying2FA(false);
    }
  };

  const handle2FACancel = () => {
    setShow2FAModal(false);
    setPendingSessionId(null);
    setLoading(false);
  };

  // ENHANCED: handleBiometricLogin with selected role
  const handleBiometricLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address first');
      return;
    }

    if (!biometricAvailable) {
      Alert.alert('Not Available', biometricError || 'Biometric authentication is not available on this device');
      return;
    }

    setBiometricLoading(true);
    setBiometricError('');

    try {
      console.log('🔐 Starting biometric login with role:', selectedRole);
      
      // ENHANCED: Pass selected role to biometric login
      const result = await AuthService.biometricLogin(email, selectedRole);

      if (result.success) {
        console.log('✅ Biometric login successful with fresh token');
        onLogin(result.user, result.session.access_token);
      } else if (result.requiresTwoFactor) {
        console.log('🔐 Biometric login requires 2FA, showing 2FA modal');
        setPendingSessionId(result.pendingSessionId);
        setShow2FAModal(true);
        setBiometricError('Biometric authentication successful. Please complete 2FA verification.');
      } else {
        throw new Error(result.error || 'Biometric login failed');
      }

    } catch (error) {
      setBiometricError(`Biometric login failed: ${error.message}`);
      Alert.alert(
        'Authentication Failed', 
        'Biometric login failed. Please try signing in with your password.',
        [
          { text: 'OK' },
          { 
            text: 'Clear Biometric Data', 
            style: 'destructive',
            onPress: () => {
              BiometricService.clearStoredCredentials(email)
                .then(() => {
                  setShowBiometricPrompt(false);
                  Alert.alert('Cleared', 'Biometric data has been cleared. Please sign in with your password to re-enable biometric authentication.');
                })
                .catch(console.error);
            }
          }
        ]
      );
    } finally {
      setBiometricLoading(false);
    }
  };

  return (
    <LinearGradient colors={theme.gradients.background} style={{ flex: 1 }}>
      <FloatingParticles />
      
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={{
                flex: 1,
                paddingHorizontal: 24,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              {/* Logo Section */}
              <View style={{ alignItems: 'center', marginTop: 40, marginBottom: 32 }}>
                <FriendlyLogo size={140} />
              </View>

              {/* Welcome Text */}
              <View style={{ alignItems: 'center', marginBottom: 32 }}>
                <Text style={{
                  fontSize: 28,
                  fontWeight: '800',
                  color: theme.colors.text,
                  marginBottom: 8,
                  textAlign: 'center',
                }}>
                  {isSignUp ? 'Join ProSwipe' : 'Welcome Back!'}
                </Text>
                <Text style={{
                  fontSize: 16,
                  color: theme.colors.textSecondary,
                  textAlign: 'center',
                  lineHeight: 24,
                  paddingHorizontal: 16,
                }}>
                  {isSignUp 
                    ? 'Create your account and connect with amazing professionals in your area' 
                    : 'Sign in to continue your home service journey'
                  }
                </Text>
              </View>

              {/* ENHANCED: User Capabilities Display for existing users with role selection and signup */}
              {!isSignUp && (
                <UserCapabilitiesDisplay 
                  userCapabilities={userCapabilities}
                  selectedRole={selectedRole}
                  onRoleSelect={setSelectedRole} // NEW: Pass role selection handler
                  onSwitchMode={handleModeSwitch}
                  onEnableMode={handleModeEnable}
                  onShowSignup={handleShowSignup} // NEW: Pass signup handler
                  loading={switchingMode || enablingMode || loading}
                />
              )}

              {/* Form Section */}
              <View style={{ marginBottom: 24 }}>
                {isSignUp && (
                  <>
                    <FloatingInput
                      placeholder="Full Name"
                      value={fullName}
                      onChangeText={setFullName}
                      icon="person-outline"
                      error={errors.fullName}
                    />
                    
                    <FloatingInput
                      placeholder="Phone Number"
                      value={phone}
                      onChangeText={setPhone}
                      icon="call-outline"
                      keyboardType="phone-pad"
                      error={errors.phone}
                    />
                    
                    <EnhancedUserTypeSelector 
                      userType={userType} 
                      setUserType={setUserType} 
                      allowDual={true}
                    />
                  </>
                )}

                <FloatingInput
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  icon="mail-outline"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                />
                
                <FloatingInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  icon="lock-closed-outline"
                  secureTextEntry
                  error={errors.password}
                />

                {/* ENHANCED: Biometric button with role-aware text */}
                {!isSignUp && showBiometricPrompt && (
                  <BouncyButton
                    title={
                      userCapabilities && userCapabilities.is_homeowner && userCapabilities.is_contractor
                        ? `Sign in as ${selectedRole === 'homeowner' ? 'Homeowner' : 'Professional'}` 
                        : "Sign in with Biometric"
                    }
                    onPress={handleBiometricLogin}
                    variant={
                      userCapabilities && userCapabilities.is_homeowner && userCapabilities.is_contractor 
                        ? (selectedRole === 'homeowner' ? 'primary' : 'secondary')
                        : 'secondary'
                    }
                    icon="finger-print-outline"
                    loading={biometricLoading}
                    disabled={biometricLoading || (userCapabilities && userCapabilities.is_homeowner && userCapabilities.is_contractor && !selectedRole)}
                  />
                )}

                {/* Biometric messages */}
                {!isSignUp && biometricError && (
                  <View style={{ 
                    marginBottom: 16, 
                    padding: 12, 
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderRadius: theme.borderRadius.sm,
                    borderLeftWidth: 4,
                    borderLeftColor: biometricError.includes('Sign in with') || biometricError.includes('session expired') ? theme.colors.primary : theme.colors.secondary
                  }}>
                    <Text style={{
                      color: theme.colors.textSecondary,
                      fontSize: 14,
                      fontWeight: '500',
                    }}>
                      {biometricError.includes('Sign in with') || biometricError.includes('session expired') ? '🔓' : 'ℹ️'} {biometricError}
                    </Text>
                  </View>
                )}

                <BouncyButton
                  title={isSignUp ? 'Create Account' : 'Sign In'}
                  onPress={handleAuth}
                  loading={loading}
                  disabled={loading}
                  icon={isSignUp ? "person-add-outline" : "log-in-outline"}
                />

                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    paddingVertical: 20,
                    marginTop: 8,
                  }}
                  onPress={() => {
                    setIsSignUp(!isSignUp);
                    // Reset form when switching modes
                    if (!isSignUp) {
                      setFullName('');
                      setPhone('');
                      setUserType('homeowner');
                    }
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    color: theme.colors.textSecondary,
                    textAlign: 'center',
                  }}>
                    {isSignUp 
                      ? 'Already have an account? ' 
                      : "Don't have an account? "
                    }
                  </Text>
                  <Text style={{
                    fontSize: 16,
                    color: theme.colors.primary,
                    fontWeight: '700',
                    marginTop: 4,
                  }}>
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>

          <Friendly2FAModal
            visible={show2FAModal}
            email={email}
            onVerify={handle2FAVerification}
            onCancel={handle2FACancel}
            loading={verifying2FA}
          />

          {/* NEW: Account Type Signup Modal */}
          <AccountTypeSignupModal
            visible={showSignupModal}
            userCapabilities={userCapabilities}
            onSignup={handleAccountTypeSignup}
            onCancel={handleSignupCancel}
            loading={signupLoading}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}