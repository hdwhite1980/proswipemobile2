// hooks/useReviews.js
import { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';

export const useReviews = (userType) => {
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsStats, setReviewsStats] = useState(null);

  const loadMyReviews = async () => {
    try {
      setReviewsLoading(true);
      console.log('⭐ Loading homeowner reviews...');

      const { reviews: reviewsData, statistics } = await ApiService.getMyReviews();
      
      setReviews(reviewsData);
      setReviewsStats(statistics);
      console.log('✅ Reviews loaded:', reviewsData.length);
    } catch (error) {
      console.error('❌ Failed to load reviews:', error);
      setReviews([]);
      setReviewsStats(null);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (userType === 'homeowner') {
      loadMyReviews();
    }
  }, [userType]);

  return {
    reviews,
    reviewsLoading,
    reviewsStats,
    loadMyReviews
  };
};