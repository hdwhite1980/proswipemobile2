// components/VerificationBadge.js - Reusable Verification Badge Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const VerificationBadge = ({ 
  isVerified, 
  licenseNumber, 
  state, 
  size = 'medium',
  showDetails = true,
  style = {}
}) => {
  if (!isVerified) return null;

  const sizes = {
    small: {
      padding: 6,
      iconSize: 12,
      fontSize: 12,
      borderRadius: 8,
    },
    medium: {
      padding: 8,
      iconSize: 16,
      fontSize: 14,
      borderRadius: 12,
    },
    large: {
      padding: 12,
      iconSize: 20,
      fontSize: 16,
      borderRadius: 16,
    }
  };

  const currentSize = sizes[size];

  return (
    <LinearGradient
      colors={['#32D74B', '#28CD41']}
      style={[
        styles.verifiedBadge,
        {
          paddingHorizontal: currentSize.padding * 1.5,
          paddingVertical: currentSize.padding,
          borderRadius: currentSize.borderRadius,
        },
        style
      ]}
    >
      <Ionicons 
        name="checkmark-circle" 
        size={currentSize.iconSize} 
        color="white" 
        style={styles.badgeIcon}
      />
      <View style={styles.badgeTextContainer}>
        <Text style={[styles.badgeTitle, { fontSize: currentSize.fontSize }]}>
          Verified Professional
        </Text>
        {showDetails && licenseNumber && (
          <Text style={[styles.badgeSubtitle, { fontSize: currentSize.fontSize - 2 }]}>
            {state ? `${state} License` : 'Licensed'} • {licenseNumber}
          </Text>
        )}
      </View>
    </LinearGradient>
  );
};

// Enhanced ProfileScreen.js with Verification Badge
const ProfileScreenVerificationEnhancement = `
// Add this to your existing ProfileScreen.js renderProfessionalStats function

const renderProfessionalStats = () => {
  if (!isContractor()) return null;

  const animStyle = sectionAnimations[0] ? {
    opacity: sectionAnimations[0].opacity,
    transform: [
      { translateY: sectionAnimations[0].translateY },
      { scale: sectionAnimations[0].scale }
    ]
  } : {};

  return (
    <Animated.View style={[styles.statsSection, animStyle]}>
      <LinearGradient
        colors={['#FF6B35', '#FF5722']}
        style={styles.statsSectionGradient}
      >
        {/* 🆕 NEW: Add verification status at the top */}
        <View style={styles.verificationStatusContainer}>
          {user?.licenseVerified ? (
            <VerificationBadge 
              isVerified={true}
              licenseNumber={user?.licenseNumber}
              state={user?.licenseState}
              size="large"
              showDetails={true}
            />
          ) : (
            <TouchableOpacity 
              style={styles.getVerifiedButton}
              onPress={() => navigation.navigate('Certifications')}
            >
              <View style={styles.getVerifiedContent}>
                <Ionicons name="shield-outline" size={20} color="rgba(255,255,255,0.8)" />
                <Text style={styles.getVerifiedText}>Get Verified</Text>
                <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.6)" />
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.statsHeader}>
          <View style={styles.statsHeaderContent}>
            <Text style={styles.statsSectionTitle}>Professional Overview</Text>
            <Text style={styles.statsSectionSubtitle}>
              {statsLoading ? 'Loading your performance metrics...' : 'Your real performance metrics'}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={loadProfessionalStatistics}
            disabled={statsLoading}
          >
            <Ionicons 
              name="refresh" 
              size={18} 
              color="white" 
              style={[
                styles.refreshIcon,
                statsLoading && styles.refreshIconSpinning
              ]} 
            />
          </TouchableOpacity>
        </View>
        
        {/* Rest of your existing stats content */}
      </LinearGradient>
    </Animated.View>
  );
};

// Add these styles to your ProfileScreen.js styles:
const additionalProfileStyles = {
  verificationStatusContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  getVerifiedButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  getVerifiedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  getVerifiedText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
  },
};
`;

// Enhanced BusinessProfileScreen.js with Verification Badge
const BusinessProfileScreenVerificationEnhancement = `
// Add this to your existing BusinessProfileScreen.js header section

const renderBusinessHeader = () => (
  <View style={styles.header}>
    <Text style={styles.title}>Business Profile</Text>
    <Text style={styles.subtitle}>Manage your professional information</Text>
    
    {/* 🆕 NEW: Verification Status Banner */}
    {businessProfile.isVerified ? (
      <View style={styles.verificationBanner}>
        <VerificationBadge 
          isVerified={true}
          licenseNumber={businessProfile.licenseNumber}
          state={businessProfile.licenseState}
          size="medium"
          showDetails={true}
        />
      </View>
    ) : (
      <TouchableOpacity 
        style={styles.verificationPrompt}
        onPress={() => navigation.navigate('Certifications')}
      >
        <LinearGradient
          colors={['#FFF4E0', '#FFE4DB']}
          style={styles.verificationPromptGradient}
        >
          <View style={styles.verificationPromptContent}>
            <Ionicons name="shield-outline" size={24} color="#FF9F0A" />
            <View style={styles.verificationPromptText}>
              <Text style={styles.verificationPromptTitle}>Get Verified</Text>
              <Text style={styles.verificationPromptSubtitle}>
                Verify your license to unlock all features and build trust with customers
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FF9F0A" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    )}
  </View>
);

// Add these styles to your BusinessProfileScreen.js:
const additionalBusinessProfileStyles = {
  verificationBanner: {
    marginTop: 16,
    alignItems: 'center',
  },
  verificationPrompt: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  verificationPromptGradient: {
    padding: 16,
  },
  verificationPromptContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  verificationPromptText: {
    flex: 1,
  },
  verificationPromptTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9F0A',
    marginBottom: 2,
  },
  verificationPromptSubtitle: {
    fontSize: 14,
    color: '#8B7355',
    lineHeight: 18,
  },
};
`;

// Enhanced JobCard.js with Contractor Verification Badge
const JobCardVerificationEnhancement = `
// Add this to your existing JobCard.js in the contractor details section

// In your JobCard component, add verification badge to homeowner section:
<View style={styles.homeownerContainer}>
  <Image
    source={{ 
      uri: job.profiles?.avatar_url || 'https://via.placeholder.com/32/007AFF/white?text=H' 
    }}
    style={styles.avatar}
  />
  <View style={styles.homeownerInfo}>
    <Text style={styles.homeownerName}>
      {job.profiles?.full_name || 'Homeowner'}
    </Text>
    
    {/* 🆕 NEW: Show verification status if available */}
    {job.homeowner?.isVerified && (
      <View style={styles.homeownerVerification}>
        <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
        <Text style={styles.verifiedText}>Verified</Text>
      </View>
    )}
  </View>
  
  {/* ✅ NEW: Urgency indicator */}
  {job.urgency && job.urgency !== 'normal' && (
    <View style={[styles.urgencyBadge, styles[\`urgency\${job.urgency}\`]]}>
      <Text style={styles.urgencyText}>
        {job.urgency.toUpperCase()}
      </Text>
    </View>
  )}
</View>

// Add these styles to your JobCard.js:
const additionalJobCardStyles = {
  homeownerInfo: {
    flex: 1,
  },
  homeownerVerification: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
};
`;

// Enhanced CertificationsScreen.js with Verification Features
export const CertificationsScreenEnhancements = `
// screens/CertificationsScreen.js - ENHANCED WITH VERIFICATION FEATURES

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { VerificationBadge } from '../components/VerificationBadge';

export default function CertificationsScreen({ navigation, route }) {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const shouldStartVerification = route?.params?.shouldStartVerification;

  useEffect(() => {
    loadCertifications();
    loadVerificationStatus();
  }, []);

  useEffect(() => {
    if (shouldStartVerification && certifications.length > 0) {
      handleVerifyAll();
    }
  }, [shouldStartVerification, certifications]);

  const loadCertifications = async () => {
    try {
      const response = await CertificationService.getCertifications();
      setCertifications(response.certifications || []);
    } catch (error) {
      console.error('Failed to load certifications:', error);
      Alert.alert('Error', 'Failed to load certifications');
    } finally {
      setLoading(false);
    }
  };

  const loadVerificationStatus = async () => {
    try {
      const response = await ApiService.get('/certifications/verification-status');
      if (response.success) {
        setVerificationStatus(response.verificationStatus);
      }
    } catch (error) {
      console.error('Failed to load verification status:', error);
    }
  };

  const handleVerifyCertification = async (certificationId) => {
    try {
      setVerifying(certificationId);
      console.log('🔍 Starting verification for certification:', certificationId);

      const response = await ApiService.post(\`/certifications/\${certificationId}/verify\`);
      
      if (response.success) {
        Alert.alert(
          response.verification.isValid ? 'Verification Successful! ✅' : 'Verification Failed ❌',
          response.message,
          [{ text: 'OK' }]
        );
        
        // Refresh certifications and status
        await loadCertifications();
        await loadVerificationStatus();
      }
    } catch (error) {
      console.error('Verification failed:', error);
      
      if (error.message.includes('not available for this state')) {
        Alert.alert(
          'State Not Supported Yet',
          'We currently only support license verification in Missouri and Virginia. More states coming soon!',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Verification Failed', error.message || 'Unable to verify license at this time');
      }
    } finally {
      setVerifying(null);
    }
  };

  const handleVerifyAll = async () => {
    try {
      setVerifying('all');
      
      const unverifiedCerts = certifications.filter(cert => !cert.isVerified);
      if (unverifiedCerts.length === 0) {
        Alert.alert('All Set!', 'All your certifications are already verified.');
        return;
      }

      const certIds = unverifiedCerts.map(cert => cert.id);
      const response = await ApiService.post('/certifications/bulk-verify', {
        certificationIds: certIds
      });

      if (response.success) {
        const { total, verified, failed } = response.summary;
        Alert.alert(
          'Bulk Verification Complete',
          \`Successfully verified \${verified} out of \${total} certifications.\${failed > 0 ? \` \${failed} failed verification.\` : ''}\`,
          [{ text: 'OK' }]
        );
        
        await loadCertifications();
        await loadVerificationStatus();
      }
    } catch (error) {
      console.error('Bulk verification failed:', error);
      Alert.alert('Bulk Verification Failed', error.message || 'Unable to verify licenses at this time');
    } finally {
      setVerifying(null);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadCertifications(), loadVerificationStatus()]);
    setRefreshing(false);
  };

  const renderVerificationStatusHeader = () => (
    <View style={styles.statusHeader}>
      <LinearGradient
        colors={verificationStatus?.isVerified ? ['#32D74B', '#28CD41'] : ['#FF9F0A', '#FF8800']}
        style={styles.statusHeaderGradient}
      >
        <View style={styles.statusHeaderContent}>
          <Ionicons 
            name={verificationStatus?.isVerified ? "shield-checkmark" : "shield-outline"} 
            size={32} 
            color="white" 
          />
          <View style={styles.statusHeaderText}>
            <Text style={styles.statusHeaderTitle}>
              {verificationStatus?.isVerified ? 'Fully Verified Professional' : 'Verification Needed'}
            </Text>
            <Text style={styles.statusHeaderSubtitle}>
              {verificationStatus?.verifiedCertifications || 0} of {verificationStatus?.totalCertifications || 0} certifications verified
            </Text>
          </View>
        </View>
        
        {verificationStatus && !verificationStatus.isVerified && (
          <TouchableOpacity 
            style={styles.verifyAllButton}
            onPress={handleVerifyAll}
            disabled={verifying === 'all'}
          >
            {verifying === 'all' ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="checkmark-done" size={16} color="white" />
                <Text style={styles.verifyAllButtonText}>Verify All</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );

  const renderCertificationCard = (cert) => (
    <View key={cert.id} style={styles.certCard}>
      <View style={styles.certHeader}>
        <View style={styles.certInfo}>
          <Text style={styles.certName}>{cert.name}</Text>
          <Text style={styles.certOrg}>{cert.issuingOrganization}</Text>
          {cert.certificationNumber && (
            <Text style={styles.certNumber}>License: {cert.certificationNumber}</Text>
          )}
        </View>
        
        {cert.isVerified && (
          <VerificationBadge 
            isVerified={true}
            size="small"
            showDetails={false}
          />
        )}
      </View>

      <View style={styles.certDetails}>
        <View style={styles.certMeta}>
          <Text style={styles.certMetaText}>
            State: {cert.licenseState || 'Not specified'}
          </Text>
          {cert.verifiedAt && (
            <Text style={styles.certMetaText}>
              Verified: {new Date(cert.verifiedAt).toLocaleDateString()}
            </Text>
          )}
        </View>

        <View style={styles.certActions}>
          {!cert.isVerified ? (
            <TouchableOpacity 
              style={styles.verifyButton}
              onPress={() => handleVerifyCertification(cert.id)}
              disabled={verifying === cert.id}
            >
              <LinearGradient
                colors={['#FF6B35', '#FF5722']}
                style={styles.verifyButtonGradient}
              >
                {verifying === cert.id ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="shield-checkmark" size={16} color="white" />
                    <Text style={styles.verifyButtonText}>Verify License</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.verifiedStatus}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.verifiedStatusText}>Verified ✓</Text>
            </View>
          )}
        </View>
      </View>

      {cert.verificationNotes && (
        <View style={styles.verificationNotes}>
          <Text style={styles.verificationNotesText}>{cert.verificationNotes}</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading certifications...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Certifications</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {/* Navigate to add certification */}}
        >
          <Ionicons name="add" size={24} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {verificationStatus && renderVerificationStatusHeader()}

        <View style={styles.certificationsSection}>
          <Text style={styles.sectionTitle}>Your Certifications</Text>
          
          {certifications.length > 0 ? (
            certifications.map(renderCertificationCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="ribbon-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateTitle}>No Certifications Yet</Text>
              <Text style={styles.emptyStateText}>
                Add your professional licenses and certifications to get verified
              </Text>
              <TouchableOpacity style={styles.addFirstCertButton}>
                <LinearGradient
                  colors={['#FF6B35', '#FF5722']}
                  style={styles.addFirstCertButtonGradient}
                >
                  <Ionicons name="add" size={20} color="white" />
                  <Text style={styles.addFirstCertButtonText}>Add Certification</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Information Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About License Verification</Text>
          <Text style={styles.infoText}>
            We verify licenses with official state databases to ensure authenticity and build trust with homeowners.
          </Text>
          
          <View style={styles.supportedStates}>
            <Text style={styles.supportedStatesTitle}>Currently Supported States:</Text>
            <View style={styles.statesList}>
              <View style={styles.stateItem}>
                <Text style={styles.stateText}>🏛️ Missouri</Text>
              </View>
              <View style={styles.stateItem}>
                <Text style={styles.stateText}>🏛️ Virginia</Text>
              </View>
            </View>
            <Text style={styles.moreStatesText}>More states coming soon!</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles for enhanced CertificationsScreen
const certificationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f2f2f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE4DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusHeader: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  statusHeaderGradient: {
    padding: 20,
  },
  statusHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusHeaderText: {
    flex: 1,
    marginLeft: 16,
  },
  statusHeaderTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusHeaderSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  verifyAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  verifyAllButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  certificationsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  certCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  certHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  certInfo: {
    flex: 1,
  },
  certName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  certOrg: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  certNumber: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  certDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  certMeta: {
    flex: 1,
  },
  certMetaText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  certActions: {
    alignItems: 'flex-end',
  },
  verifyButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  verifyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  verifiedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedStatusText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  verificationNotes: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  verificationNotesText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  addFirstCertButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addFirstCertButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  addFirstCertButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  supportedStates: {
    alignItems: 'center',
  },
  supportedStatesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  statesList: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  stateItem: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  stateText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  moreStatesText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});
`;

const styles = StyleSheet.create({
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeIcon: {
    marginRight: 6,
  },
  badgeTextContainer: {
    flex: 1,
  },
  badgeTitle: {
    color: 'white',
    fontWeight: '600',
  },
  badgeSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginTop: 1,
  },
});