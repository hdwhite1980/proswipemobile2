// components/profile/ReviewsSection.js
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileStyles from '../../styles/ProfileStyles';

const ReviewsSection = ({ 
  reviews, 
  reviewsLoading, 
  reviewsStats, 
  onNavigateToReviews,
  animStyle 
}) => {
  return (
    <Animated.View style={[ProfileStyles.section, animStyle]}>
      <View style={ProfileStyles.sectionHeader}>
        <Text style={ProfileStyles.sectionTitle}>Your Reviews</Text>
        <Text style={ProfileStyles.sectionSubtitle}>Reviews you've given to contractors</Text>
      </View>
      
      {reviewsLoading ? (
        <View style={ProfileStyles.reviewsLoadingContainer}>
          <ActivityIndicator size="small" color="#FF6B35" />
          <Text style={ProfileStyles.reviewsLoadingText}>Loading your reviews...</Text>
        </View>
      ) : reviews.length > 0 ? (
        <>
          {/* Reviews Stats */}
          {reviewsStats && (
            <View style={ProfileStyles.reviewsStatsCard}>
              <View style={ProfileStyles.reviewsStatsHeader}>
                <View style={ProfileStyles.reviewsStatItem}>
                  <Text style={ProfileStyles.reviewsStatValue}>{reviewsStats.totalReviews}</Text>
                  <Text style={ProfileStyles.reviewsStatLabel}>Reviews Given</Text>
                </View>
                <View style={ProfileStyles.reviewsStatDivider} />
                <View style={ProfileStyles.reviewsStatItem}>
                  <View style={ProfileStyles.ratingContainer}>
                    <Text style={ProfileStyles.reviewsStatValue}>
                      {reviewsStats.averageRating?.toFixed(1) || '0.0'}
                    </Text>
                    <Ionicons name="star" size={16} color="#FFD700" style={ProfileStyles.starIcon} />
                  </View>
                  <Text style={ProfileStyles.reviewsStatLabel}>Avg Rating Given</Text>
                </View>
              </View>
            </View>
          )}

          {/* Recent Reviews */}
          <View style={ProfileStyles.reviewsList}>
            {reviews.slice(0, 3).map((review, index) => (
              <View key={review.id || index} style={ProfileStyles.reviewCard}>
                <View style={ProfileStyles.reviewHeader}>
                  <View style={ProfileStyles.reviewRating}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name={star <= review.rating ? "star" : "star-outline"}
                        size={16}
                        color={star <= review.rating ? "#FFD700" : "#E5E5EA"}
                      />
                    ))}
                  </View>
                  <Text style={ProfileStyles.reviewDate}>
                    {new Date(review.created_at).toLocaleDateString()}
                  </Text>
                </View>
                
                <Text style={ProfileStyles.reviewJobTitle}>
                  {review.job?.title || 'Service Job'}
                </Text>
                
                <Text style={ProfileStyles.reviewContractor}>
                  Review for: {review.contractor ?
                    `${review.contractor.first_name} ${review.contractor.last_name}` :
                    'Contractor'}
                </Text>
                
                {review.review_text && (
                  <Text style={ProfileStyles.reviewText} numberOfLines={2}>
                    {review.review_text}
                  </Text>
                )}
              </View>
            ))}
          </View>

          {reviews.length > 3 && (
            <TouchableOpacity 
              style={ProfileStyles.viewAllReviewsButton}
              onPress={onNavigateToReviews}
            >
              <Text style={ProfileStyles.viewAllReviewsText}>
                View All {reviews.length} Reviews
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#FF6B35" />
            </TouchableOpacity>
          )}
        </>
      ) : (
        <View style={ProfileStyles.emptyReviewsState}>
          <Ionicons name="star-outline" size={48} color="#E5E5EA" />
          <Text style={ProfileStyles.emptyReviewsTitle}>No Reviews Yet</Text>
          <Text style={ProfileStyles.emptyReviewsText}>
            Complete jobs and leave reviews for contractors to build your reputation
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

export default ReviewsSection;