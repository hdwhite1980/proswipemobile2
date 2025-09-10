// components/profile/EditProfileModal.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileStyles from '../../styles/ProfileStyles';

const EditProfileModal = ({ 
  visible, 
  onClose, 
  user, 
  onSave, 
  updating 
}) => {
  const [editForm, setEditForm] = useState({
    phone: user?.phone || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
  });

  const handleSave = async () => {
    try {
      const updateData = {
        phone: editForm.phone,
        city: editForm.city,
        state: editForm.state,
        zip_code: editForm.zipCode,
      };

      await onSave(updateData);
      onClose();
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={ProfileStyles.modalContainer}>
        <LinearGradient
          colors={['#F2F2F7', '#FFFFFF']}
          style={ProfileStyles.modalBackground}
        >
          <View style={ProfileStyles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Text style={ProfileStyles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={ProfileStyles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSave} disabled={updating}>
              <LinearGradient
                colors={updating ? ['#999', '#999'] : ['#FF6B35', '#FF5722']}
                style={ProfileStyles.modalSaveButton}
              >
                <Text style={ProfileStyles.modalSaveText}>
                  {updating ? 'Saving...' : 'Save'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <ScrollView style={ProfileStyles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={ProfileStyles.inputGroup}>
              <Text style={ProfileStyles.inputLabel}>Phone Number</Text>
              <View style={ProfileStyles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#8E8E93" style={ProfileStyles.inputIcon} />
                <TextInput
                  style={ProfileStyles.input}
                  value={editForm.phone}
                  onChangeText={(text) => setEditForm(prev => ({...prev, phone: text}))}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={ProfileStyles.inputGroup}>
              <Text style={ProfileStyles.inputLabel}>City</Text>
              <View style={ProfileStyles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="#8E8E93" style={ProfileStyles.inputIcon} />
                <TextInput
                  style={ProfileStyles.input}
                  value={editForm.city}
                  onChangeText={(text) => setEditForm(prev => ({...prev, city: text}))}
                  placeholder="Enter city"
                />
              </View>
            </View>

            <View style={ProfileStyles.inputGroup}>
              <Text style={ProfileStyles.inputLabel}>State</Text>
              <View style={ProfileStyles.inputContainer}>
                <Ionicons name="map-outline" size={20} color="#8E8E93" style={ProfileStyles.inputIcon} />
                <TextInput
                  style={ProfileStyles.input}
                  value={editForm.state}
                  onChangeText={(text) => setEditForm(prev => ({...prev, state: text}))}
                  placeholder="Enter state"
                />
              </View>
            </View>

            <View style={ProfileStyles.inputGroup}>
              <Text style={ProfileStyles.inputLabel}>ZIP Code</Text>
              <View style={ProfileStyles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#8E8E93" style={ProfileStyles.inputIcon} />
                <TextInput
                  style={ProfileStyles.input}
                  value={editForm.zipCode}
                  onChangeText={(text) => setEditForm(prev => ({...prev, zipCode: text}))}
                  placeholder="Enter ZIP code"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );
};

export default EditProfileModal;