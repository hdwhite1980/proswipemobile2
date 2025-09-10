// hooks/useAIFeatures.js - Hook for managing AI feature access
import { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';

export const useAIFeatures = () => {
  const [hasBudgetAccess, setHasBudgetAccess] = useState(false);
  const [hasChecklistAccess, setHasChecklistAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAIAccess = async () => {
    try {
      setLoading(true);
      const response = await ApiService.get('/payments/ai-features-status');
      
      if (response.success) {
        setHasBudgetAccess(response.features.budget || false);
        setHasChecklistAccess(response.features.checklist || false);
      }
    } catch (error) {
      console.log('❌ Error checking AI access:', error);
      // Default to no access on error
      setHasBudgetAccess(false);
      setHasChecklistAccess(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshAccess = async () => {
    await checkAIAccess();
  };

  useEffect(() => {
    checkAIAccess();
  }, []);

  return {
    hasBudgetAccess,
    hasChecklistAccess,
    loading,
    refreshAccess,
  };
};