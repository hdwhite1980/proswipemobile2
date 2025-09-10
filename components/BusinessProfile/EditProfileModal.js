// components/BusinessProfile/EditProfileModal.js
import React from 'react';
import {
  Modal,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const BUSINESS_TYPES = [
  'Sole Proprietorship', 'LLC', 'Corporation', 'Partnership', 'Other'
];

export const EditProfileModal = ({ 
  visible, 
  editForm, 
  setEditForm, 
  onSave, 
  onCancel, 
  saving 
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.modalCancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Edit Business Profile</Text>
          <TouchableOpacity onPress={onSave} disabled={saving}>
            <Text style={[styles.modalSave, saving && styles.modalSaveDisabled]}>
              {saving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Business Name *</Text>
            <TextInput
              style={styles.input}
              value={editForm.businessName}
              onChangeText={(text) => setEditForm(prev => ({...prev, businessName: text}))}
              placeholder="Enter your business name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Business Type</Text>
            <View style={styles.pickerContainer}>
              {BUSINESS_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.pickerOption,
                    editForm.businessType === type && styles.pickerOptionSelected
                  ]}
                  onPress={() => setEditForm(prev => ({...prev, businessType: type}))}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    editForm.businessType === type && styles.pickerOptionTextSelected
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Business Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editForm.businessDescription}
              onChangeText={(text) => setEditForm(prev => ({...prev, businessDescription: text}))}
              placeholder="Describe your business and services"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Years of Experience</Text>
            <TextInput
              style={styles.input}
              value={editForm.yearsExperience}
              onChangeText={(text) => setEditForm(prev => ({...prev, yearsExperience: text}))}
              placeholder="e.g., 5"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Service Area Radius (miles)</Text>
            <TextInput
              style={styles.input}
              value={editForm.serviceAreaRadius}
              onChangeText={(text) => setEditForm(prev => ({...prev, serviceAreaRadius: text}))}
              placeholder="e.g., 25"
              keyboardType="numeric"
            />
            <Text style={styles.inputHelper}>
              How many miles from your base location do you serve?
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Business Address</Text>
            <TextInput
              style={styles.input}
              value={editForm.businessAddress}
              onChangeText={(text) => setEditForm(prev => ({...prev, businessAddress: text}))}
              placeholder="Your business address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Business Phone</Text>
            <TextInput
              style={styles.input}
              value={editForm.businessPhone}
              onChangeText={(text) => setEditForm(prev => ({...prev, businessPhone: text}))}
              placeholder="(555) 123-4567"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>License Number</Text>
            <TextInput
              style={styles.input}
              value={editForm.licenseNumber}
              onChangeText={(text) => setEditForm(prev => ({...prev, licenseNumber: text}))}
              placeholder="Enter your license number"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>License State</Text>
            <TextInput
              style={styles.input}
              value={editForm.licenseState}
              onChangeText={(text) => setEditForm(prev => ({...prev, licenseState: text.toUpperCase()}))}
              placeholder="VA"
              maxLength={2}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Insurance Provider</Text>
            <TextInput
              style={styles.input}
              value={editForm.insuranceProvider}
              onChangeText={(text) => setEditForm(prev => ({...prev, insuranceProvider: text}))}
              placeholder="Enter your insurance company"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Insurance Policy Number</Text>
            <TextInput
              style={styles.input}
              value={editForm.insurancePolicyNumber}
              onChangeText={(text) => setEditForm(prev => ({...prev, insurancePolicyNumber: text}))}
              placeholder="Enter policy number"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Website URL</Text>
            <TextInput
              style={styles.input}
              value={editForm.websiteUrl}
              onChangeText={(text) => setEditForm(prev => ({...prev, websiteUrl: text}))}
              placeholder="https://your-website.com"
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tax ID</Text>
            <TextInput
              style={styles.input}
              value={editForm.taxId}
              onChangeText={(text) => setEditForm(prev => ({...prev, taxId: text}))}
              placeholder="Enter your tax ID"
            />
          </View>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setEditForm(prev => ({...prev, bonded: !prev.bonded}))}
          >
            <Ionicons 
              name={editForm.bonded ? "checkbox" : "checkbox-outline"} 
              size={24} 
              color="#FF6B35" 
            />
            <Text style={styles.checkboxLabel}>Bonded</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setEditForm(prev => ({...prev, backgroundChecked: !prev.backgroundChecked}))}
          >
            <Ionicons 
              name={editForm.backgroundChecked ? "checkbox" : "checkbox-outline"} 
              size={24} 
              color="#FF6B35" 
            />
            <Text style={styles.checkboxLabel}>Background Checked</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <Text style={styles.sectionLabel}>Additional Info (Not saved to backend yet)</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Hourly Rate ($)</Text>
            <TextInput
              style={styles.input}
              value={editForm.hourlyRate}
              onChangeText={(text) => setEditForm(prev => ({...prev, hourlyRate: text}))}
              placeholder="e.g., 75"
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setEditForm(prev => ({...prev, emergencyAvailable: !prev.emergencyAvailable}))}
          >
            <Ionicons 
              name={editForm.emergencyAvailable ? "checkbox" : "checkbox-outline"} 
              size={24} 
              color="#FF6B35" 
            />
            <Text style={styles.checkboxLabel}>Available for emergency calls</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  modalCancel: {
    fontSize: 17,
    color: '#FF6B35',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  modalSave: {
    fontSize: 17,
    color: '#FF6B35',
    fontWeight: '600',
  },
  modalSaveDisabled: {
    opacity: 0.5,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  inputHelper: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  pickerOptionSelected: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  pickerOptionTextSelected: {
    color: 'white',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
});

export default EditProfileModal;