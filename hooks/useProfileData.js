// hooks/useProfileData.js
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import ApiService from '../services/ApiService';

export const useProfileData = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const [notifications, setNotifications] = useState({
    jobAlerts: true,
    applicationUpdates: true,
    messages: true,
    marketing: false,
  });

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getUserProfile();
      setUser(response.user);
      return response.user;
    } catch (error) {
      console.error('Failed to load profile:', error);
      Alert.alert('Error', 'Failed to load profile information');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationSettings = async () => {
    try {
      const response = await ApiService.getNotificationSettings();
      if (response && response.settings) {
        setNotifications(response.settings);
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    }
  };

  const checkUserType = async () => {
    try {
      const storedUserType = await ApiService.getUserType();
      setUserType(storedUserType);
      return storedUserType;
    } catch (error) {
      console.error('Failed to get user type:', error);
      return null;
    }
  };

  const updateNotificationSetting = async (key, value) => {
    try {
      const currentNotifications = notifications || {
        jobAlerts: true,
        applicationUpdates: true,
        messages: true,
        marketing: false,
      };
      
      const updatedSettings = { ...currentNotifications, [key]: value };
      setNotifications(updatedSettings);
      
      await ApiService.updateNotificationSetting(key, value);
    } catch (error) {
      console.error('Failed to update notification setting:', error);
      // Revert on error
      setNotifications(notifications || {
        jobAlerts: true,
        applicationUpdates: true,
        messages: true,
        marketing: false,
      });
    }
  };

  const updateProfile = async (updateData) => {
    try {
      const response = await ApiService.updateProfile(updateData);
      setUser(response.user);
      return response.user;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const isContractor = () => {
    if (user?.userType === 'contractor') return true;
    if (user?.user_type === 'contractor') return true;
    if (user?.role === 'contractor') return true;
    if (userType === 'contractor') return true;
    return userType !== 'homeowner';
  };

  const isHomeowner = () => {
    if (user?.userType === 'homeowner') return true;
    if (user?.user_type === 'homeowner') return true;
    if (user?.role === 'homeowner') return true;
    if (userType === 'homeowner') return true;
    return userType === 'homeowner';
  };

  useEffect(() => {
    loadUserProfile();
    loadNotificationSettings();
    checkUserType();
  }, []);

  return {
    user,
    loading,
    userType,
    notifications,
    isContractor,
    isHomeowner,
    loadUserProfile,
    updateProfile,
    updateNotificationSetting,
    checkUserType
  };
};