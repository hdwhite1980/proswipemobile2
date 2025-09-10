// components/BusinessProfile/LogoSection.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const LogoSection = ({ 
  businessProfile, 
  onUploadLogo, 
  onEditProfile, 
  uploadingLogo 
}) => {
  return (
    <View style={styles.logoSection}>
      <TouchableOpacity 
        style={styles.logoContainer} 
        onPress={onUploadLogo}
        disabled={uploadingLogo}
      >
        {businessProfile.businessLogo ? (
          <Image source={{ uri: businessProfile.businessLogo }} style={styles.logo} />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Ionicons name="business" size={32} color="#FF6B35" />
            <Text style={styles.logoPlaceholderText}>Add Logo</Text>
          </View>
        )}
        
        {uploadingLogo ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color="white" />
          </View>
        ) : (
          <View style={styles.logoOverlay}>
            <Ionicons name="camera" size={16} color="white" />
          </View>
        )}
      </TouchableOpacity>
      
      <View style={styles.businessInfo}>
        <Text style={styles.businessName}>
          {businessProfile.businessName || 'Business Name'}
        </Text>
        <Text style={styles.businessDescription}>
          {businessProfile.businessDescription || 'Add a description of your business'}
        </Text>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={onEditProfile}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  logoSection: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#FFE4DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholderText: {
    fontSize: 12,
    color: '#FF6B35',
    marginTop: 4,
    fontWeight: '500',
  },
  logoOverlay: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  loadingOverlay: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  businessInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  businessDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  editButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LogoSection;