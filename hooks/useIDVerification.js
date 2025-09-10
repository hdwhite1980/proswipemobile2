// hooks/useIDVerification.js - FIXED FOR REACT NATIVE SDK
import { useState, useCallback, useEffect, useRef } from 'react';
import { apiClient } from '../services/ApiService';

export const useIDVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // ✅ FIXED: Use new API method
  const checkVerificationStatus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.getVerificationStatus();
      
      if (response.success) {
        setVerificationStatus(response);
        setIsVerified(response.verified || false);
        return response;
      } else {
        setVerificationStatus(null);
        setIsVerified(false);
        return { success: false, status: 'not_started', verified: false };
      }
    } catch (error) {
      console.error('❌ Failed to check verification status:', error);
      setVerificationStatus(null);
      setIsVerified(false);
      return { success: false, status: 'not_started', verified: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ SIMPLIFIED: No separate sync needed - status check is enough
  const refreshVerificationStatus = useCallback(async () => {
    console.log('🔄 Refreshing verification status...');
    return await checkVerificationStatus();
  }, [checkVerificationStatus]);

  // ✅ HELPER: Get verification progress
  const getVerificationProgress = useCallback(async () => {
    try {
      return await apiClient.getVerificationProgress();
    } catch (error) {
      console.error('❌ Failed to get verification progress:', error);
      return 0;
    }
  }, []);

  // ✅ HELPER: Get verification status message
  const getVerificationStatusMessage = useCallback(async () => {
    try {
      return await apiClient.getVerificationStatusMessage();
    } catch (error) {
      console.error('❌ Failed to get verification status message:', error);
      return 'Unable to check verification status';
    }
  }, []);

  // ✅ HELPER: Quick verification check
  const isUserVerified = useCallback(async () => {
    try {
      return await apiClient.isUserVerified();
    } catch (error) {
      console.error('❌ Failed to check if user is verified:', error);
      return false;
    }
  }, []);

  // Load verification status on hook initialization
  useEffect(() => {
    checkVerificationStatus();
  }, [checkVerificationStatus]);

  return {
    // State
    verificationStatus,
    loading,
    isVerified,
    
    // Actions
    checkVerificationStatus,
    refreshVerificationStatus,
    
    // Helpers
    getVerificationProgress,
    getVerificationStatusMessage,
    isUserVerified,
    
    // Legacy compatibility (deprecated - use new methods)
    syncVerificationStatus: refreshVerificationStatus, // For backward compatibility
  };
};

  // ✅ Enhanced verification status hook with controlled auto-polling
export const useIDVerificationStatus = () => {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const pollIntervalRef = useRef(null);
  const pollAttemptRef = useRef(0);
  const lastLoadTime = useRef(0);
  const maxPollAttempts = 40; // Poll for ~10 minutes max (15s intervals)

  const loadVerificationStatus = useCallback(async (forceRefresh = false) => {
    try {
      // Prevent rapid successive calls
      const now = Date.now();
      if (!forceRefresh && hasLoaded && (now - lastLoadTime.current) < 2000) {
        console.log('🔄 Skipping verification status load - too recent');
        return verificationStatus;
      }
      
      console.log(`🔍 Loading verification status (forceRefresh: ${forceRefresh})...`);
      setLoading(true);
      lastLoadTime.current = now;
      
      const response = await apiClient.getVerificationStatus();
      
      if (response.success) {
        setVerificationStatus(response);
        console.log('✅ Verification status loaded:', response.status);
        
        // Start polling if status is pending
        if (response.status === 'pending' || response.status === 'processing') {
          startPolling();
        } else {
          stopPolling();
        }
        
        setHasLoaded(true);
        return response;
      } else {
        console.warn('⚠️ No verification status found');
        setVerificationStatus(null);
        stopPolling();
        setHasLoaded(true);
      }
    } catch (error) {
      console.error('❌ Failed to load verification status:', error);
      setVerificationStatus(null);
      stopPolling();
      setHasLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [hasLoaded, verificationStatus]);

  // ✅ Simplified refresh using the new API
  const refreshStatus = useCallback(async () => {
    try {
      console.log('🔄 Refreshing verification status...');
      await loadVerificationStatus(true);
    } catch (error) {
      console.error('❌ Manual refresh failed:', error);
    }
  }, [loadVerificationStatus]);

  // ✅ Start polling for status updates
  const startPolling = useCallback(() => {
    if (pollIntervalRef.current) return; // Already polling
    
    console.log('🔄 Starting auto-polling for verification status updates...');
    pollAttemptRef.current = 0;
    
    const pollFunction = async () => {
      pollAttemptRef.current += 1;
      
      console.log(`🔍 Auto-poll attempt ${pollAttemptRef.current}/${maxPollAttempts}`);
      
      try {
        const response = await apiClient.getVerificationStatus();
        
        if (response.success) {
          const status = response.status;
          console.log('📊 Polled status:', status);
          
          // If status changed from pending, reload and stop polling
          if (status !== 'pending' && status !== 'processing') {
            console.log('✅ Status changed from pending! Reloading...');
            await loadVerificationStatus(true);
            stopPolling();
            return;
          }
        }
        
        // Stop polling after max attempts
        if (pollAttemptRef.current >= maxPollAttempts) {
          console.log('⏰ Max polling attempts reached, stopping auto-poll');
          stopPolling();
        }
        
      } catch (error) {
        console.error('❌ Polling error:', error);
      }
    };
    
    // Poll every 15 seconds
    pollIntervalRef.current = setInterval(pollFunction, 15000);
    
    // Also do an immediate poll
    setTimeout(pollFunction, 2000);
  }, [loadVerificationStatus]);

  // ✅ Stop polling
  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      console.log('🛑 Stopping auto-polling');
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
      pollAttemptRef.current = 0;
    }
  }, []);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return { 
    verificationStatus, 
    loading, 
    hasLoaded,
    loadVerificationStatus,
    refreshStatus,
    isPolling: !!pollIntervalRef.current
  };
};

// ✅ Combined verification status hook for ProfileScreen with rate limiting
export const useCompleteVerificationStatus = () => {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const lastLoadTime = useRef(0);

  const loadVerificationStatus = useCallback(async (forceRefresh = false) => {
    try {
      // Rate limiting: prevent calls within 2 seconds unless forced
      const now = Date.now();
      if (!forceRefresh && hasLoaded && (now - lastLoadTime.current) < 2000) {
        console.log('🔄 Skipping verification status load - too recent');
        return verificationStatus;
      }
      
      console.log(`🔍 Loading complete verification status (forceRefresh: ${forceRefresh})...`);
      setLoading(true);
      lastLoadTime.current = now;
      
      // Use the simplified API for complete status
      const response = await apiClient.getVerificationStatus();
      
      if (response.success) {
        // Transform to expected format for backward compatibility
        const transformedStatus = {
          id: response.id || null,
          status: response.status || 'not_started',
          decision: response.decision || null,
          completedAt: response.completedAt || null,
          sessionId: response.sessionId || null,
          url: response.url || null,
          confidenceScore: response.confidenceScore || null,
          
          // License verification status
          licenseVerified: response.licenseVerified || false,
          
          // Overall verification flags
          idVerified: response.verified || false,
          fullyVerified: (response.verified && response.licenseVerified) || false
        };
        
        setVerificationStatus(transformedStatus);
        console.log('✅ Complete verification status loaded:', transformedStatus.status);
        
        setHasLoaded(true);
        return transformedStatus;
      } else {
        console.warn('⚠️ No complete verification status found');
        const defaultStatus = {
          id: null,
          status: 'not_started',
          decision: null,
          completedAt: null,
          sessionId: null,
          url: null,
          licenseVerified: false,
          idVerified: false,
          fullyVerified: false
        };
        setVerificationStatus(defaultStatus);
        setHasLoaded(true);
      }
    } catch (error) {
      console.error('❌ Failed to load complete verification status:', error);
      const defaultStatus = {
        id: null,
        status: 'not_started',
        decision: null,
        completedAt: null,
        sessionId: null,
        url: null,
        licenseVerified: false,
        idVerified: false,
        fullyVerified: false
      };
      setVerificationStatus(defaultStatus);
      setHasLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [hasLoaded, verificationStatus]);

  // ✅ Manual refresh using simplified API
  const refreshStatus = useCallback(async () => {
    try {
      console.log('🔄 Manual refresh: Getting latest status...');
      setLoading(true);
      
      await loadVerificationStatus(true);
      
      return {
        success: true,
        message: 'Status refreshed successfully',
        reloaded: true
      };
    } catch (error) {
      console.error('❌ Manual refresh failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loadVerificationStatus]);

  return { 
    verificationStatus, 
    loading, 
    hasLoaded,
    loadVerificationStatus,
    refreshStatus
  };
};