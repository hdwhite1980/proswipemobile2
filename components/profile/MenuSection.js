// components/profile/MenuSection.js - Updated with Verification Badge Support
import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileStyles from '../../styles/ProfileStyles';

const MenuSection = ({ 
  title, 
  subtitle, 
  children, 
  animStyle 
}) => {
  return (
    <Animated.View style={[ProfileStyles.section, animStyle]}>
      <View style={ProfileStyles.sectionHeader}>
        <Text style={ProfileStyles.sectionTitle}>{title}</Text>
        <Text style={ProfileStyles.sectionSubtitle}>{subtitle}</Text>
      </View>
      {children}
    </Animated.View>
  );
};

const MenuItem = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  showArrow = true, 
  rightContent = null, 
  iconColor = '#FF6B35', 
  iconBgColor = '#FFE4DB' 
}) => (
  <TouchableOpacity 
    style={ProfileStyles.menuItem} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={ProfileStyles.menuItemLeft}>
      <LinearGradient
        colors={[iconBgColor, iconBgColor + '80']}
        style={ProfileStyles.menuIcon}
      >
        <Ionicons name={icon} size={22} color={iconColor} />
      </LinearGradient>
      <View style={ProfileStyles.menuItemText}>
        <Text style={ProfileStyles.menuItemTitle}>{title}</Text>
        {subtitle && <Text style={ProfileStyles.menuItemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <View style={ProfileStyles.menuItemRight}>
      {/* ✅ NEW: Support for custom right content (like verification badges) */}
      {rightContent}
      {showArrow && (
        <View style={ProfileStyles.arrowContainer}>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const CustomSwitch = ({ value, onValueChange }) => (
  <TouchableOpacity
    style={[ProfileStyles.customSwitch, value && ProfileStyles.customSwitchActive]}
    onPress={() => onValueChange(!value)}
    activeOpacity={0.8}
  >
    <Animated.View
      style={[
        ProfileStyles.customSwitchThumb,
        {
          transform: [{
            translateX: value ? 22 : 2
          }]
        }
      ]}
    />
  </TouchableOpacity>
);

MenuSection.Item = MenuItem;
MenuSection.Switch = CustomSwitch;

export default MenuSection;