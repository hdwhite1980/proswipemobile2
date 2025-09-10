// components/common/ModeSwitchButton.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../../services/ApiService';

// ProSwipe theme
const theme = {
  colors: {
    primary: '#FF6B35',
    secondary: '#007AFF',
    success: '#32D74B',
    background: '#FFFFFF',
    backgroundSecondary: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    error: '#EF4444',
    border: '#E5E7EB',
  },
  gradients: {
    homeowner: ['#FF6B35', '#FF5722'],
    contractor: ['#007AFF', '#0051D5'],
    dual: ['#FF6B35', '#007AFF'],
  },
  borderRadius: {
    sm: 12, md: 16, lg: 24,
  },
  shadows: {
    medium: {
      shadowColor: '#FF6B35',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
    },
  },
};

/**
 * ModeSwitchButton - A reusable component for switching between homeowner and contractor modes
 * 
 * Props:
 * - user: Current user object with capabilities
 * - onSwitchComplete: Callback when switch is successful (receives updated user object)
 * - style: Optional style overrides
 * - compact: Boolean for compact mode (smaller button)
 * - showLabel: Boolean to show/hide the label text
 */
const ModeSwitchButton = ({ 
  user, 
  onSwitchComplete, 
  style = {}, 
  compact = false,
  showLabel = true 
}) => {
  const [switching, setSwitching] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.7)).current;

  // Check if user can switch modes
  const canSwitch = user?.isDualUser || (user?.isHomeowner && user?.isContractor);
  const currentMode = user?.activeUserType || user?.userType;
  const targetMode = currentMode === 'homeowner' ? 'contractor' : 'homeowner';
  
  const currentModeLabel = currentMode === 'homeowner' ? 'Homeowner' : 'Professional';
  const targetModeLabel = targetMode === 'homeowner' ? 'Homeowner' : 'Professional';

  useEffect(() => {
    if (!switching) {
      // Gentle glow animation when not switching
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.7,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Rotation animation while switching
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [switching]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    handleModeSwitch();
  };

  const handleModeSwitch = async () => {
    if (!canSwitch) {
      Alert.alert(
        'Mode Switch Not Available',
        'You only have access to one user type. Contact support to enable additional access.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Show confirmation for first-time switchers
    const hasSeenSwitchWarning = await AsyncStorage.getItem('has_seen_mode_switch_warning');
    
    if (!hasSeenSwitchWarning) {
      Alert.alert(
        `Switch to ${targetModeLabel} Mode?`,
        `You're about to switch to ${targetModeLabel} mode. This will change your view and available features.\n\n⚠️ Remember: You cannot hire yourself or bid on your own jobs when switching between modes.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: `Switch to ${targetModeLabel}`, 
            onPress: () => {
              AsyncStorage.setItem('has_seen_mode_switch_warning', 'true');
              performModeSwitch();
            }
          }
        ]
      );
    } else {
      performModeSwitch();
    }
  };

  const performModeSwitch = async () => {
    setSwitching(true);
    
    try {
      console.log(`🔄 Switching from ${currentMode} to ${targetMode} mode...`);
      
      const response = await apiClient.post('/auth/switch-user-type', {
        userId: user.id,
        newActiveType: targetMode,
      });

      if (response.data.success) {
        // Update stored user type
        await AsyncStorage.setItem('user_type', targetMode);
        await AsyncStorage.setItem('active_user_type', targetMode);
        
        // Create updated user object
        const updatedUser = {
          ...user,
          userType: targetMode,
          activeUserType: targetMode,
        };
        
        console.log(`✅ Successfully switched to ${targetMode} mode`);
        
        // Call the completion callback
        if (onSwitchComplete) {
          onSwitchComplete(updatedUser);
        }
        
        // Show success message
        Alert.alert(
          'Mode Switched!',
          `You're now in ${targetModeLabel} mode. Your view and available features have been updated.`,
          [{ text: 'Got it!' }]
        );
        
      } else {
        throw new Error(response.data.error || 'Failed to switch user type');
      }
    } catch (error) {
      console.error('❌ Mode switch failed:', error);
      Alert.alert(
        'Switch Failed',
        error.response?.data?.error || error.message || 'Could not switch user type. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setSwitching(false);
      rotateAnim.setValue(0); // Reset rotation
    }
  };

  // Don't render if user can't switch
  if (!canSwitch) {
    return null;
  }

  const buttonHeight = compact ? 48 : 56;
  const iconSize = compact ? 18 : 20;
  const fontSize = compact ? 14 : 16;

  const currentGradient = currentMode === 'homeowner' ? theme.gradients.homeowner : theme.gradients.contractor;
  const targetGradient = targetMode === 'homeowner' ? theme.gradients.homeowner : theme.gradients.contractor;

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        {
          borderRadius: theme.borderRadius.md,
          overflow: 'hidden',
          ...theme.shadows.medium,
          transform: [{ scale: scaleAnim }],
          opacity: glowAnim,
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        disabled={switching}
        activeOpacity={0.9}
        style={{
          borderRadius: theme.borderRadius.md,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={switching ? theme.gradients.dual : targetGradient}
          style={{
            paddingVertical: compact ? 12 : 16,
            paddingHorizontal: compact ? 16 : 20,
            minHeight: buttonHeight,
            justifyContent: 'center',
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {switching ? (
              <Animated.View 
                style={{ 
                  marginRight: 8,
                  transform: [{ rotate }],
                }}
              >
                <Ionicons 
                  name="sync-outline" 
                  size={iconSize} 
                  color="#FFFFFF" 
                />
              </Animated.View>
            ) : (
              <Ionicons
                name="swap-horizontal-outline"
                size={iconSize}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
            )}
            
            <Text style={{
              color: '#FFFFFF',
              fontSize: fontSize,
              fontWeight: '700',
              textAlign: 'center',
            }}>
              {switching 
                ? 'Switching...' 
                : `Switch to ${targetModeLabel}`
              }
            </Text>
          </View>
          
          {showLabel && !compact && (
            <Text style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: 12,
              textAlign: 'center',
              marginTop: 4,
            }}>
              Currently: {currentModeLabel} Mode
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ModeSwitchButton;