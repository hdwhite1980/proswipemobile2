// hooks/useCompleteVerificationStatus.js
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/ApiService';

export const useCompleteVerificationStatus = () => {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Load verification status from API
  const loadVerificationStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Loading complete verification status...');
      
      const response = await apiClient.getVerificationStatus();
      
      if (response && response.success) {
        const status = {
          // ID Verification status
          status: response.status || 'not_started',
          verified: response.verified || false,
          idVerified: response.verified || false,
          
          // Additional status info
          method: response.method || 'unknown',
          completionPercentage: calculateCompletionPercentage(response),
          
          // Timestamps
          createdAt: response.created_at,
          updatedAt: response.updated_at,
          
          // Raw response for debugging
          rawResponse: response
        };
        
        setVerificationStatus(status);
        console.log('✅ Verification status loaded:', status);
      } else {
        // No verification found or failed - set default
        const defaultStatus = {
          status: 'not_started',
          verified: false,
          idVerified: false,
          method: 'none',
          completionPercentage: 0,
          rawResponse: response
        };
        
        setVerificationStatus(defaultStatus);
        console.log('⚠️ Using default verification status:', defaultStatus);
      }
      
      setHasLoaded(true);
    } catch (error) {
      console.error('❌ Failed to load verification status:', error);
      setError(error.message);
      
      // Set error fallback status
      const fallbackStatus = {
        status: 'error',
        verified: false,
        idVerified: false,
        method: 'error',
        completionPercentage: 0,
        error: error.message
      };
      
      setVerificationStatus(fallbackStatus);
      setHasLoaded(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh status (for manual refresh)
  const refreshStatus = useCallback(async () => {
    console.log('🔄 Manually refreshing verification status...');
    try {
      await loadVerificationStatus();
      return { success: true };
    } catch (error) {
      console.error('❌ Manual refresh failed:', error);
      return { success: false, error: error.message };
    }
  }, [loadVerificationStatus]);

  // Calculate completion percentage based on status
  const calculateCompletionPercentage = (response) => {
    if (!response || !response.status) return 0;
    
    switch (response.status) {
      case 'not_started':
        return 0;
      case 'pending':
        return 30;
      case 'processing':
        return 70;
      case 'completed':
        return response.verified ? 100 : 0;
      default:
        return 0;
    }
  };

  // Get human-readable status message
  const getStatusMessage = useCallback(() => {
    if (loading) return 'Loading verification status...';
    if (error) return 'Unable to check verification status';
    if (!verificationStatus) return 'No verification data';
    
    switch (verificationStatus.status) {
      case 'not_started':
        return 'Identity verification not started';
      case 'pending':
        return 'Verification documents submitted, awaiting review';
      case 'processing':
        return 'Verification in progress, please wait';
      case 'completed':
        return verificationStatus.verified 
          ? 'Identity verified successfully' 
          : 'Verification declined, please try again';
      case 'error':
        return 'Error checking verification status';
      default:
        return 'Unknown verification status';
    }
  }, [verificationStatus, loading, error]);

  // Check if user is verified
  const isVerified = useCallback(() => {
    return verificationStatus?.verified === true;
  }, [verificationStatus]);

  // Check if verification is in progress
  const isInProgress = useCallback(() => {
    return verificationStatus?.status === 'pending' || verificationStatus?.status === 'processing';
  }, [verificationStatus]);

  // Check if verification can be started
  const canStartVerification = useCallback(() => {
    return !verificationStatus?.status || 
           verificationStatus.status === 'not_started' || 
           (verificationStatus.status === 'completed' && !verificationStatus.verified);
  }, [verificationStatus]);

  // Load status on hook initialization (only once)
  useEffect(() => {
    // Only load if we haven't loaded yet
    if (!hasLoaded) {
      console.log('🔍 Initial verification status load');
      loadVerificationStatus();
    }
  }, []); // Empty dependency array - only run once on mount

  return {
    // Status data
    verificationStatus,
    loading,
    hasLoaded,
    error,
    
    // Actions
    loadVerificationStatus,
    refreshStatus,
    
    // Computed properties
    isVerified: isVerified(),
    isInProgress: isInProgress(),
    canStartVerification: canStartVerification(),
    statusMessage: getStatusMessage(),
    
    // Helper methods
    getStatusMessage,
    calculateCompletionPercentage: (response) => calculateCompletionPercentage(response)
  };
};