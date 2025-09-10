// components/profile/ProfileHeader.js - Complete integration with ImageUploadService
import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageUploadService } from '../../services/ImageUploadService';
import ProfileStyles from '../../styles/ProfileStyles';

const ProfileHeader = ({ 
  user, 
  verificationStatus, 
  fadeAnim, 
  slideAnim, 
  scaleAnim, 
  onUpdateProfileImage // New prop for handling profile image updates
}) => {
  const handleChangeAvatar = async () => {
    try {
      // Show options: Camera or Gallery using ImageUploadService
      ImageUploadService.showImagePickerOptions(
        // Gallery option
        async () => {
          try {
            const imageAsset = await ImageUploadService.pickImage({
              aspect: [1, 1], // Square aspect ratio for profile pics
              quality: 0.8
            });
            
            if (imageAsset) {
              await uploadProfileImage(imageAsset);
            }
          } catch (error) {
            console.error('Gallery picker error:', error);
            Alert.alert('Error', 'Failed to pick image from gallery');
          }
        },
        // Camera option
        async () => {
          try {
            const imageAsset = await ImageUploadService.takePhoto({
              aspect: [1, 1], // Square aspect ratio for profile pics
              quality: 0.8
            });
            
            if (imageAsset) {
              await uploadProfileImage(imageAsset);
            }
          } catch (error) {
            console.error('Camera error:', error);
            Alert.alert('Error', 'Failed to take photo');
          }
        },
        // Cancel option
        () => {
          console.log('User cancelled image selection');
        }
      );
    } catch (error) {
      console.error('Error in handleChangeAvatar:', error);
      Alert.alert('Error', 'Failed to access camera or gallery');
    }
  };

  const uploadProfileImage = async (imageAsset) => {
    try {
      console.log('📸 Uploading profile image...', imageAsset);
      
      // Show loading feedback
      Alert.alert('Uploading...', 'Please wait while we upload your profile picture');
      
      // Upload using ImageUploadService with 'profile' type
      const imageUrl = await ImageUploadService.uploadImageToBackend(imageAsset, 'profile');
      
      console.log('✅ Profile image uploaded successfully:', imageUrl);
      
      // Call the parent component's callback to update user state
      if (onUpdateProfileImage) {
        await onUpdateProfileImage(imageUrl);
      } else {
        // Fallback if no handler provided
        console.log('No onUpdateProfileImage handler provided');
      }
      
      Alert.alert('Success!', 'Profile picture updated successfully');
      
    } catch (error) {
      console.error('❌ Failed to upload profile image:', error);
      Alert.alert('Upload Failed', 'Failed to upload profile picture. Please try again.');
    }
  };

  // ✅ Check if user is ID verified
  const isIDVerified = () => {
    // Check verification status from the hook
    if (verificationStatus?.status === 'completed' && verificationStatus?.verified) {
      return true;
    }
    if (verificationStatus?.idVerified) {
      return true;
    }
    // Legacy check for user object
    if (user?.idVerified || user?.id_verified) {
      return true;
    }
    return false;
  };

  // ✅ Check if user is license verified (for contractors)
  const isLicenseVerified = () => {
    return user?.licenseVerified || user?.license_verified || verificationStatus?.licenseVerified;
  };

  return (
    <Animated.View
      style={[
        ProfileStyles.profileHeader,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <LinearGradient
        colors={['#FFFFFF', '#F8F9FA']}
        style={ProfileStyles.profileHeaderGradient}
      >
        <TouchableOpacity style={ProfileStyles.avatarContainer} onPress={handleChangeAvatar}>
          <View style={ProfileStyles.avatarShadow}>
            <Image
              source={{ 
                uri: user?.avatarUrl || user?.profile_image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&size=120&background=FF6B35&color=fff`
              }}
              style={ProfileStyles.avatar}
            />
          </View>
          <LinearGradient
            colors={['#FF6B35', '#FF5722']}
            style={ProfileStyles.avatarOverlay}
          >
            <Ionicons name="camera" size={18} color="white" />
          </LinearGradient>

          {/* ✅ ID Verified Badge on Avatar */}
          {isIDVerified() && (
            <View style={ProfileStyles.avatarVerificationBadge}>
              <LinearGradient
                colors={['#32D74B', '#28CD41']}
                style={ProfileStyles.avatarVerificationBadgeGradient}
              >
                <Ionicons name="checkmark-circle" size={16} color="white" />
              </LinearGradient>
            </View>
          )}
        </TouchableOpacity>
        
        <Text style={ProfileStyles.userName}>{user?.fullName || 'User'}</Text>
        <Text style={ProfileStyles.userEmail}>{user?.email}</Text>
        
        {/* ✅ Verification Badges (removed house icon for homeowners) */}
        <View style={ProfileStyles.verificationBadgesContainer}>
          {/* ID Verified Badge (for all users - no house icon) */}
          {isIDVerified() && !isLicenseVerified() && (
            <View style={ProfileStyles.verifiedBadge}>
              <LinearGradient
                colors={['#32D74B', '#28CD41']}
                style={ProfileStyles.verifiedBadgeGradient}
              >
                <Ionicons name="checkmark-circle" size={16} color="white" />
                <Text style={ProfileStyles.verifiedText}>Verified User</Text>
              </LinearGradient>
            </View>
          )}

          {/* License Verification Badge (for contractors only) */}
          {isLicenseVerified() && (
            <View style={ProfileStyles.verifiedBadge}>
              <LinearGradient
                colors={['#32D74B', '#28CD41']}
                style={ProfileStyles.verifiedBadgeGradient}
              >
                <Ionicons name="ribbon" size={16} color="white" />
                <Text style={ProfileStyles.verifiedText}>Licensed Professional</Text>
              </LinearGradient>
            </View>
          )}

          {/* Combined Badge when both ID and license are verified (contractors only) */}
          {isIDVerified() && isLicenseVerified() && (
            <View style={ProfileStyles.verifiedBadge}>
              <LinearGradient
                colors={['#FF6B35', '#FF5722']}
                style={ProfileStyles.verifiedBadgeGradient}
              >
                <Ionicons name="star" size={16} color="white" />
                <Text style={ProfileStyles.verifiedText}>Fully Verified Professional</Text>
              </LinearGradient>
            </View>
          )}

          {/* Pending Verification Indicator */}
          {!isIDVerified() && verificationStatus?.status === 'pending' && (
            <View style={ProfileStyles.verifiedBadge}>
              <LinearGradient
                colors={['#FF9F0A', '#FF8800']}
                style={ProfileStyles.verifiedBadgeGradient}
              >
                <Ionicons name="time" size={16} color="white" />
                <Text style={ProfileStyles.verifiedText}>Verification Pending</Text>
              </LinearGradient>
            </View>
          )}
        </View>
        
        {/* ✅ REMOVED: Edit Profile Button */}
      </LinearGradient>
    </Animated.View>
  );
};

export default ProfileHeader;