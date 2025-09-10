// hooks/useBusinessProfile.js - Migrated to Modular Services
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { ImageUploadService } from '../services/ImageUploadService';

// MIGRATED: Use BusinessProfileService instead of ApiService
import { BusinessProfileService } from '../services';

export const useBusinessProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  
  const [businessProfile, setBusinessProfile] = useState({
    businessName: '',
    businessType: '',
    businessDescription: '',
    serviceCategories: [],
    yearsExperience: '',
    licenseNumber: '',
    licenseState: '',
    licenseExpiry: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    insuranceExpiry: '',
    serviceAreaRadius: '',
    serviceAreaText: '',
    websiteUrl: '',
    logoUrl: '',
    businessAddress: '',
    businessPhone: '',
    taxId: '',
    bonded: false,
    backgroundChecked: false,
    hourlyRate: '',
    emergencyAvailable: false,
    businessLogo: null,
    portfolio: [],
  });

  // MIGRATED: Load business profile using BusinessProfileService
  const loadBusinessProfile = async () => {
    try {
      setLoading(true);
      console.log('📥 Loading business profile...');
      
      // MIGRATED: Use BusinessProfileService instead of ApiService.get
      const response = await BusinessProfileService.getBusinessProfile();
      console.log('📥 Profile response:', response);
      
      if (response.profile) {
        const profile = response.profile;
        setBusinessProfile({
          // Backend fields
          businessName: profile.businessName || '',
          businessType: profile.businessType || '',
          businessDescription: profile.businessDescription || '',
          yearsExperience: profile.yearsExperience?.toString() || '',
          licenseNumber: profile.licenseNumber || '',
          licenseState: profile.licenseState || '',
          licenseExpiry: profile.licenseExpiry || '',
          insuranceProvider: profile.insuranceProvider || '',
          insurancePolicyNumber: profile.insurancePolicyNumber || '',
          insuranceExpiry: profile.insuranceExpiry || '',
          serviceAreaRadius: profile.serviceAreaRadius?.toString() || '25',
          websiteUrl: profile.websiteUrl || '',
          logoUrl: profile.logoUrl || '',
          businessAddress: profile.businessAddress || '',
          businessPhone: profile.businessPhone || '',
          taxId: profile.taxId || '',
          bonded: profile.bonded || false,
          backgroundChecked: profile.backgroundChecked || false,
          
          // New fields from backend
          serviceCategories: profile.serviceCategories || [],
          serviceAreaText: `${profile.serviceAreaRadius || 25} mile radius`,
          hourlyRate: profile.hourlyRate?.toString() || '',
          emergencyAvailable: profile.emergencyAvailable || false,
          businessLogo: profile.logoUrl || null,
          portfolio: profile.portfolio || [],
        });
      } else {
        console.log('📥 No profile found, using defaults');
        setBusinessProfile(getDefaultProfile());
      }
    } catch (error) {
      console.error('❌ Failed to load business profile:', error);
      if (!error.message.includes('404')) {
        Alert.alert('Error', 'Failed to load business profile');
      }
    } finally {
      setLoading(false);
    }
  };

  // MIGRATED: Save business profile using BusinessProfileService
  const saveBusinessProfile = async (formData) => {
    try {
      setSaving(true);
      console.log('💾 Starting save business profile...');
      
      // Validate required fields
      if (!formData.businessName?.trim()) {
        Alert.alert('Validation Error', 'Business name is required');
        return false;
      }

      // Convert and validate data for backend - ONLY send fields backend can handle
      const backendData = {
        businessName: formData.businessName?.trim() || '',
        businessType: formData.businessType || '',
        licenseNumber: formData.licenseNumber?.trim() || '',
        licenseState: formData.licenseState?.trim() || '',
        licenseExpiry: formData.licenseExpiry || null,
        insuranceProvider: formData.insuranceProvider?.trim() || '',
        insurancePolicyNumber: formData.insurancePolicyNumber?.trim() || '',
        insuranceExpiry: formData.insuranceExpiry || null,
        yearsExperience: formData.yearsExperience ? parseInt(formData.yearsExperience) : null,
        serviceAreaRadius: formData.serviceAreaRadius ? parseInt(formData.serviceAreaRadius) : 25,
        businessDescription: formData.businessDescription?.trim() || '',
        websiteUrl: formData.websiteUrl?.trim() || '',
        logoUrl: formData.logoUrl?.trim() || '',
        businessAddress: formData.businessAddress?.trim() || '',
        businessPhone: formData.businessPhone?.trim() || '',
        taxId: formData.taxId?.trim() || '',
        bonded: formData.bonded || false,
        backgroundChecked: formData.backgroundChecked || false,
        // New fields (backend should handle these now)
        serviceCategories: formData.serviceCategories || [],
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
        emergencyAvailable: formData.emergencyAvailable || false
      };

      console.log('📤 Sending to backend:', JSON.stringify(backendData, null, 2));

      // MIGRATED: Use BusinessProfileService instead of ApiService.patch
      const response = await BusinessProfileService.updateBusinessProfile(backendData);
      console.log('📥 Backend response:', response);

      // Update local state with backend response
      const savedProfile = response.profile;
      setBusinessProfile({
        ...savedProfile,
        // Convert numbers back to strings for form display
        yearsExperience: savedProfile.yearsExperience?.toString() || '',
        serviceAreaRadius: savedProfile.serviceAreaRadius?.toString() || '25',
        serviceAreaText: `${savedProfile.serviceAreaRadius || 25} mile radius`,
        hourlyRate: savedProfile.hourlyRate?.toString() || '',
        
        // Ensure these fields are properly set
        serviceCategories: savedProfile.serviceCategories || [],
        emergencyAvailable: savedProfile.emergencyAvailable || false,
        businessLogo: savedProfile.logoUrl || businessProfile.businessLogo,
        portfolio: businessProfile.portfolio, // Keep existing portfolio
      });

      Alert.alert('Success', 'Business profile updated successfully!');
      return true;
    } catch (error) {
      console.error('❌ Failed to save business profile:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack
      });
      Alert.alert('Error', `Failed to save business profile: ${error.message}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Upload logo with better error handling
  const uploadLogo = async () => {
    try {
      setUploadingLogo(true);
      console.log('📸 Starting logo upload...');
      
      // Pick image
      const imageAsset = await ImageUploadService.pickImage({
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!imageAsset) {
        console.log('📸 No image selected');
        return;
      }

      console.log('📸 Image selected:', {
        uri: imageAsset.uri,
        type: imageAsset.type,
        fileName: imageAsset.fileName
      });

      // Upload image to backend
      let uploadedUrl;
      
      try {
        uploadedUrl = await ImageUploadService.uploadImageToBackend(imageAsset, 'logo');
        console.log('📸 Upload successful:', uploadedUrl);
      } catch (uploadError) {
        console.error('❌ Upload error:', uploadError);
        Alert.alert('Upload Failed', `Failed to upload logo: ${uploadError.message}`);
        return;
      }

      // Update profile with new logo URL
      const currentProfile = { ...businessProfile, logoUrl: uploadedUrl };
      const success = await saveBusinessProfile(currentProfile);
      
      if (success) {
        Alert.alert('Success', 'Logo uploaded successfully!');
      }
      
    } catch (error) {
      console.error('❌ Logo upload error:', error);
      Alert.alert('Error', `Failed to upload logo: ${error.message}`);
    } finally {
      setUploadingLogo(false);
    }
  };

  // Upload portfolio images
  const uploadPortfolioImages = async () => {
    try {
      setUploadingPortfolio(true);
      console.log('📸 Starting portfolio upload...');
      
      // Pick multiple images
      const imageAssets = await ImageUploadService.pickMultipleImages({
        quality: 0.8,
      });
      
      if (!imageAssets.length) {
        console.log('📸 No images selected');
        return;
      }

      console.log(`📸 Selected ${imageAssets.length} images for portfolio`);

      // Upload each image
      const uploadPromises = imageAssets.map(async (asset, index) => {
        try {
          console.log(`📸 Uploading image ${index + 1}/${imageAssets.length}`);
          const uploadedUrl = await ImageUploadService.uploadImageToBackend(asset, 'portfolio');
          
          return {
            id: Date.now() + index,
            imageUrl: uploadedUrl,
            caption: `Portfolio Image ${index + 1}`,
            uploadedAt: new Date().toISOString()
          };
        } catch (error) {
          console.error(`❌ Failed to upload image ${index + 1}:`, error);
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(result => result !== null);
      
      if (successfulUploads.length > 0) {
        // Update local portfolio
        setBusinessProfile(prev => ({
          ...prev,
          portfolio: [...prev.portfolio, ...successfulUploads]
        }));
        
        Alert.alert(
          'Success', 
          `${successfulUploads.length} of ${imageAssets.length} images uploaded successfully!`
        );
      } else {
        Alert.alert('Upload Failed', 'Failed to upload portfolio images');
      }
      
    } catch (error) {
      console.error('❌ Portfolio upload error:', error);
      Alert.alert('Error', `Failed to upload portfolio images: ${error.message}`);
    } finally {
      setUploadingPortfolio(false);
    }
  };

  // MIGRATED: Update service categories using BusinessProfileService
  const updateServiceCategories = async (selectedCategories) => {
    try {
      const updatedProfile = { ...businessProfile, serviceCategories: selectedCategories };
      const success = await saveBusinessProfile(updatedProfile);
      
      if (success) {
        Alert.alert('Success', 'Service categories updated successfully!');
      }
      
      return success;
    } catch (error) {
      console.error('❌ Failed to update categories:', error);
      Alert.alert('Error', 'Failed to update service categories');
      return false;
    }
  };

  // Get default profile structure
  const getDefaultProfile = () => ({
    businessName: '',
    businessType: '',
    businessDescription: '',
    serviceCategories: [],
    yearsExperience: '',
    licenseNumber: '',
    licenseState: '',
    licenseExpiry: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    insuranceExpiry: '',
    serviceAreaRadius: '25',
    serviceAreaText: '25 mile radius',
    websiteUrl: '',
    logoUrl: '',
    businessAddress: '',
    businessPhone: '',
    taxId: '',
    bonded: false,
    backgroundChecked: false,
    hourlyRate: '',
    emergencyAvailable: false,
    businessLogo: null,
    portfolio: [],
  });

  // Initialize on mount
  useEffect(() => {
    loadBusinessProfile();
  }, []);

  return {
    // State
    businessProfile,
    loading,
    saving,
    uploadingLogo,
    uploadingPortfolio,
    
    // Actions
    loadBusinessProfile,
    saveBusinessProfile,
    uploadLogo,
    uploadPortfolioImages,
    updateServiceCategories,
    setBusinessProfile,
  };
};