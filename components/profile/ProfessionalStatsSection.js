// components/profile/ProfessionalStatsSection.js - COMPLETELY FIXED
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileStyles from '../../styles/ProfileStyles';

const ProfessionalStatsSection = ({ 
  user,
  professionalStats,
  statsLoading,
  statsError,
  verificationStatus,
  verificationLoading,
  onLoadProfessionalStatistics,
  onNavigateToIDVerification,
  onNavigateToCertifications,
  onRefreshVerificationStatus,
  animStyle 
}) => {
  
  // ✅ FIXED: Get verification data from the correct sources
  const getIDVerificationStatus = () => {
    if (verificationStatus?.status) {
      return {
        isVerified: verificationStatus.status === 'completed' && verificationStatus.verified,
        status: verificationStatus.status,
        isLoading: verificationLoading
      };
    }
    
    return {
      isVerified: user?.idVerified || false,
      status: user?.idVerified ? 'completed' : 'not_started',
      isLoading: verificationLoading
    };
  };

  const getLicenseVerificationStatus = () => {
    const certifications = professionalStats?.certifications || [];
    const verifiedLicenses = certifications.filter(cert => cert.is_verified || cert.verification_status === 'verified');
    const totalLicenses = certifications.length;
    
    return {
      isVerified: totalLicenses > 0 && verifiedLicenses.length === totalLicenses,
      hasLicenses: totalLicenses > 0,
      verifiedCount: verifiedLicenses.length,
      totalCount: totalLicenses,
      isLoading: statsLoading
    };
  };

  const idStatus = getIDVerificationStatus();
  const licenseStatus = getLicenseVerificationStatus();

  return (
    <Animated.View style={[ProfileStyles.statsSection, animStyle]}>
      <LinearGradient
        colors={['#FF6B35', '#FF5722']}
        style={ProfileStyles.statsSectionGradient}
      >
        {/* ✅ COMPLETELY FIXED: Verification Status Container */}
        <View style={ProfileStyles.verificationStatusContainer}>
          <Text style={ProfileStyles.verificationSectionTitle}>Verification Status</Text>
          
          {verificationLoading ? (
            <View style={ProfileStyles.verificationLoadingContainer}>
              <ActivityIndicator size="small" color="white" />
              <Text style={ProfileStyles.verificationLoadingText}>Loading verification status...</Text>
            </View>
          ) : (
            <>
              {/* ✅ FIXED: Two-card layout with proper sizing */}
              <View style={{
                flexDirection: 'row',
                gap: 12,
                marginBottom: 16,
                paddingHorizontal: 4,
              }}>
                {/* ID Verification Card */}
                <TouchableOpacity 
                  style={[
                    {
                      flex: 1,
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      borderRadius: 12,
                      padding: 14,
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 100,
                      borderWidth: 1,
                      borderColor: idStatus.isVerified ? 'rgba(76, 175, 80, 0.4)' : 'rgba(255,255,255,0.2)',
                    },
                    idStatus.isVerified && { backgroundColor: 'rgba(76, 175, 80, 0.2)' }
                  ]}
                  onPress={onNavigateToIDVerification}
                  activeOpacity={0.8}
                >
                  <View style={{ alignItems: 'center', marginBottom: 6 }}>
                    <Ionicons 
                      name={idStatus.isVerified ? "checkmark-circle" : "person-outline"} 
                      size={24} 
                      color={idStatus.isVerified ? "#4CAF50" : "rgba(255,255,255,0.9)"} 
                    />
                  </View>
                  <Text style={{
                    fontSize: 11,
                    fontWeight: '600',
                    color: idStatus.isVerified ? "#4CAF50" : "rgba(255,255,255,0.9)",
                    textAlign: 'center',
                    marginBottom: 4,
                    lineHeight: 13,
                  }}>
                    ID Verification
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: idStatus.isVerified ? "#4CAF50" : "rgba(255,255,255,0.8)",
                    textAlign: 'center',
                  }}>
                    {idStatus.isVerified ? 'Verified ✓' : 'Required'}
                  </Text>
                  
                  {/* Show processing status for pending verifications */}
                  {idStatus.status === 'pending' && (
                    <Text style={{
                      fontSize: 9,
                      color: 'rgba(255,255,255,0.7)',
                      textAlign: 'center',
                      marginTop: 2,
                    }}>
                      Processing...
                    </Text>
                  )}
                </TouchableOpacity>

                {/* License Verification Card */}
                <TouchableOpacity 
                  style={[
                    {
                      flex: 1,
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      borderRadius: 12,
                      padding: 14,
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 100,
                      borderWidth: 1,
                      borderColor: licenseStatus.isVerified ? 'rgba(76, 175, 80, 0.4)' : 'rgba(255,255,255,0.2)',
                    },
                    licenseStatus.isVerified && { backgroundColor: 'rgba(76, 175, 80, 0.2)' }
                  ]}
                  onPress={onNavigateToCertifications}
                  activeOpacity={0.8}
                >
                  <View style={{ alignItems: 'center', marginBottom: 6 }}>
                    <Ionicons 
                      name={licenseStatus.isVerified ? "ribbon" : "ribbon-outline"} 
                      size={24} 
                      color={licenseStatus.isVerified ? "#4CAF50" : "rgba(255,255,255,0.9)"} 
                    />
                  </View>
                  <Text style={{
                    fontSize: 11,
                    fontWeight: '600',
                    color: licenseStatus.isVerified ? "#4CAF50" : "rgba(255,255,255,0.9)",
                    textAlign: 'center',
                    marginBottom: 4,
                    lineHeight: 13,
                  }}>
                    License Verification
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: licenseStatus.isVerified ? "#4CAF50" : "rgba(255,255,255,0.8)",
                    textAlign: 'center',
                  }}>
                    {licenseStatus.hasLicenses 
                      ? (licenseStatus.isVerified ? 'Verified ✓' : `${licenseStatus.verifiedCount}/${licenseStatus.totalCount}`) 
                      : 'Required'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* ✅ Refresh button for verification status */}
              {onRefreshVerificationStatus && (idStatus.status === 'pending' || idStatus.status === 'processing') && (
                <TouchableOpacity 
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    padding: 8,
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                  onPress={onRefreshVerificationStatus}
                  disabled={verificationLoading}
                >
                  <Ionicons name="refresh-outline" size={16} color="rgba(255,255,255,0.9)" />
                  <Text style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: 12,
                    fontWeight: '600',
                    marginLeft: 6,
                  }}>
                    Refresh Status
                  </Text>
                </TouchableOpacity>
              )}

              {/* Overall Verification Badge */}
              {(idStatus.isVerified || licenseStatus.isVerified) && (
                <View style={ProfileStyles.overallVerificationBadge}>
                  <LinearGradient
                    colors={
                      (idStatus.isVerified && licenseStatus.isVerified) 
                        ? ['#4CAF50', '#45A049'] 
                        : ['#FF9F0A', '#FF8800']
                    }
                    style={ProfileStyles.overallVerificationBadgeGradient}
                  >
                    <Ionicons 
                      name={
                        (idStatus.isVerified && licenseStatus.isVerified) 
                          ? "shield-checkmark" 
                          : "shield-outline"
                      } 
                      size={20} 
                      color="white" 
                    />
                    <Text style={ProfileStyles.overallVerificationBadgeText}>
                      {(idStatus.isVerified && licenseStatus.isVerified) 
                        ? 'Fully Verified Professional' 
                        : 'Partially Verified'}
                    </Text>
                  </LinearGradient>
                </View>
              )}

              {/* Verification Progress */}
              {(!idStatus.isVerified || !licenseStatus.isVerified) && (
                <View style={ProfileStyles.verificationProgress}>
                  <Text style={ProfileStyles.verificationProgressText}>
                    Complete verification to unlock all features
                  </Text>
                  <View style={ProfileStyles.verificationProgressBar}>
                    <View 
                      style={[
                        ProfileStyles.verificationProgressFill,
                        { 
                          width: `${verificationStatus?.completionPercentage || 
                            ((idStatus.isVerified ? 50 : 0) + (licenseStatus.isVerified ? 50 : 0))}%` 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={ProfileStyles.verificationProgressPercentage}>
                    {verificationStatus?.completionPercentage || 
                      ((idStatus.isVerified ? 50 : 0) + (licenseStatus.isVerified ? 50 : 0))}% Complete
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Professional stats content */}
        <View style={ProfileStyles.statsHeader}>
          <View style={ProfileStyles.statsHeaderContent}>
            <Text style={ProfileStyles.statsSectionTitle}>Professional Overview</Text>
            <Text style={ProfileStyles.statsSectionSubtitle}>
              {statsLoading ? 'Loading your performance metrics...' : 'Your real performance metrics'}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={ProfileStyles.refreshButton}
            onPress={onLoadProfessionalStatistics}
            disabled={statsLoading}
          >
            <Ionicons 
              name="refresh" 
              size={18} 
              color="white" 
              style={[
                ProfileStyles.refreshIcon,
                statsLoading && ProfileStyles.refreshIconSpinning
              ]} 
            />
          </TouchableOpacity>
        </View>
        
        {statsLoading ? (
          <View style={ProfileStyles.statsLoadingContainer}>
            <ActivityIndicator size="large" color="white" />
            <Text style={ProfileStyles.statsLoadingText}>Loading your real statistics...</Text>
          </View>
        ) : statsError ? (
          <View style={ProfileStyles.statsErrorContainer}>
            <Ionicons name="warning" size={32} color="rgba(255,255,255,0.8)" />
            <Text style={ProfileStyles.statsErrorText}>Unable to load statistics</Text>
            <Text style={ProfileStyles.statsErrorSubtext}>{statsError}</Text>
            <TouchableOpacity 
              style={ProfileStyles.retryButton}
              onPress={onLoadProfessionalStatistics}
            >
              <Text style={ProfileStyles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={ProfileStyles.statsGrid}>
              <View style={ProfileStyles.statCard}>
                <Text style={ProfileStyles.statValue}>{professionalStats?.completedJobs || 0}</Text>
                <Text style={ProfileStyles.statLabel}>Jobs Completed</Text>
              </View>
              
              <View style={ProfileStyles.statCard}>
                <View style={ProfileStyles.ratingContainer}>
                  <Text style={ProfileStyles.statValue}>
                    {professionalStats?.avgRating > 0 ? professionalStats.avgRating.toFixed(1) : '5.0'}
                  </Text>
                  <Ionicons name="star" size={16} color="#FFD700" style={ProfileStyles.starIcon} />
                </View>
                <Text style={ProfileStyles.statLabel}>Average Rating</Text>
              </View>
              
              <View style={ProfileStyles.statCard}>
                <Text style={ProfileStyles.statValue}>
                  {professionalStats?.responseTime || '1 day'}
                </Text>
                <Text style={ProfileStyles.statLabel}>Response Time</Text>
              </View>
              
              <View style={ProfileStyles.statCard}>
                <Text style={ProfileStyles.statValue}>
                  ${(professionalStats?.totalEarnings || 0).toLocaleString()}
                </Text>
                <Text style={ProfileStyles.statLabel}>Total Earnings</Text>
              </View>

              <View style={ProfileStyles.statCard}>
                <Text style={ProfileStyles.statValue}>{professionalStats?.activeJobs || 0}</Text>
                <Text style={ProfileStyles.statLabel}>Active Jobs</Text>
              </View>
              
              <View style={ProfileStyles.statCard}>
                <Text style={ProfileStyles.statValue}>
                  {professionalStats?.acceptanceRate > 0 ? `${professionalStats.acceptanceRate.toFixed(1)}%` : '--'}
                </Text>
                <Text style={ProfileStyles.statLabel}>Acceptance Rate</Text>
              </View>
            </View>
            
            <View style={ProfileStyles.performanceIndicators}>
              <Text style={ProfileStyles.performanceTitle}>Performance Indicators</Text>
              <View style={ProfileStyles.performanceList}>
                <View style={ProfileStyles.performanceItem}>
                  <Ionicons name="checkmark-circle" size={16} color="white" />
                  <Text style={ProfileStyles.performanceText}>
                    {professionalStats?.totalApplications || 0} total applications submitted
                  </Text>
                </View>
                
                <View style={ProfileStyles.performanceItem}>
                  <Ionicons name="trending-up" size={16} color="white" />
                  <Text style={ProfileStyles.performanceText}>
                    {professionalStats?.completionRate > 0 ? `${professionalStats.completionRate.toFixed(1)}%` : '0%'} completion rate
                  </Text>
                </View>
                
                <View style={ProfileStyles.performanceItem}>
                  <Ionicons name="people" size={16} color="white" />
                  <Text style={ProfileStyles.performanceText}>
                    {professionalStats?.totalReviews || 0} customer reviews
                  </Text>
                </View>
              </View>
            </View>

            <View style={ProfileStyles.dataFreshnessIndicator}>
              <Ionicons name="time" size={12} color="rgba(255,255,255,0.7)" />
              <Text style={ProfileStyles.dataFreshnessText}>
                Updated: {new Date().toLocaleDateString()}
              </Text>
            </View>
          </>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

export default ProfessionalStatsSection;