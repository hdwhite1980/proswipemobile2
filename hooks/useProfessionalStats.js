// hooks/useProfessionalStats.js - FIXED TO PREVENT LOOPS
import { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';

export const useProfessionalStats = (userType, user) => {
  const [professionalStats, setProfessionalStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false); // ✅ FIXED: Start as false
  const [statsError, setStatsError] = useState(null);
  const [existingVerificationStatus, setExistingVerificationStatus] = useState(null);
  const [existingVerificationLoading, setExistingVerificationLoading] = useState(false); // ✅ FIXED: Start as false

  const loadProfessionalStatistics = async () => {
    try {
      setStatsLoading(true);
      setStatsError(null);
      console.log('📊 Loading real professional statistics...');
      const stats = await ApiService.getProfessionalStatistics();
      setProfessionalStats(stats);
      console.log('✅ Professional stats set:', stats);
    } catch (error) {
      console.error('❌ Failed to load professional statistics:', error);
      setStatsError(error.message);
      
      // Set default stats on error
      setProfessionalStats({
        completedJobs: 0,
        avgRating: 0,
        responseTime: 'No data',
        totalEarnings: 0,
        activeJobs: 0,
        totalApplications: 0,
        acceptanceRate: 0,
        completionRate: 0,
        totalReviews: 0,
        certifications: 0,
        specialties: []
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const loadCompleteVerificationStatus = async () => {
    try {
      setExistingVerificationLoading(true);
      console.log('🔍 Loading complete verification status from stats hook...');
      const status = await ApiService.getVerificationStatus();
      
      if (status) {
        setExistingVerificationStatus(status);
        console.log('✅ Verification status loaded in stats hook:', status);
      } else {
        console.log('⚠️ Using fallback verification status in stats hook');
        const fallbackStatus = {
          hasIdVerification: false,
          idVerificationStatus: 'not_started',
          idVerificationDecision: null,
          idVerified: user?.idVerified || false,
          totalLicenses: 0,
          verifiedLicenses: 0,
          licenseVerified: user?.licenseVerified || false,
          fullyVerified: false,
          verificationLevel: 'none',
          completionPercentage: ((user?.idVerified ? 50 : 0) + (user?.licenseVerified ? 50 : 0))
        };
        setExistingVerificationStatus(fallbackStatus);
      }
    } catch (error) {
      console.error('❌ Failed to load verification status in stats hook:', error);
      const fallbackStatus = {
        hasIdVerification: false,
        idVerificationStatus: 'not_started',
        idVerificationDecision: null,
        idVerified: user?.idVerified || false,
        totalLicenses: 0,
        verifiedLicenses: 0,
        licenseVerified: user?.licenseVerified || false,
        fullyVerified: false,
        verificationLevel: 'none',
        completionPercentage: ((user?.idVerified ? 50 : 0) + (user?.licenseVerified ? 50 : 0))
      };
      setExistingVerificationStatus(fallbackStatus);
    } finally {
      setExistingVerificationLoading(false);
    }
  };

  // ✅ FIXED: Don't auto-load on mount - let parent component control loading
  // useEffect(() => {
  //   if (userType === 'contractor') {
  //     loadProfessionalStatistics();
  //     loadCompleteVerificationStatus();
  //   }
  // }, [userType]);

  // ✅ FIXED: Don't auto-load when user changes - let parent component control
  // useEffect(() => {
  //   if (userType === 'contractor' && user) {
  //     loadCompleteVerificationStatus();
  //   }
  // }, [user]);

  // ✅ Initialize hook without auto-loading
  useEffect(() => {
    console.log('📊 useProfessionalStats hook initialized for userType:', userType);
  }, []);

  return {
    professionalStats,
    statsLoading,
    statsError,
    verificationStatus: existingVerificationStatus,
    verificationLoading: existingVerificationLoading,
    loadProfessionalStatistics,
    loadCompleteVerificationStatus
  };
};