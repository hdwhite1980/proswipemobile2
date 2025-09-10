// components/JobCard.js - Enhanced with category questions display and comprehensive features
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated as RNAnimated, // ✅ FIXED: Renamed to avoid conflict
  Dimensions,
  ActivityIndicator,
  Platform
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { // ✅ FIXED: Use Reanimated's Animated without alias
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate
} from 'react-native-reanimated';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.3;

export const JobCard = ({ 
  job, 
  onSwipe,
  onPress, 
  onQuickAction, 
  userType = 'homeowner',
  style,
  isHighlighted = false,
  enableSwipe = false  // New prop to enable/disable swipe functionality
}) => {
  // Swipe gesture state
  const translateX = useSharedValue(0);
  const [swiped, setSwiped] = useState(false);
  
  // Media state
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  
  // Animation - ✅ FIXED: Using RNAnimated for React Native's Animated
  const scaleAnim = useRef(new RNAnimated.Value(1)).current;

  console.log('🎥 JobCard rendering with job:', {
    id: job.id,
    title: job.title,
    video_url: job.video_url,
    service_category_id: job.service_category_id,
    categoryQuestions: job.categoryQuestions || job.category_answers
  });

  // ✅ NEW: Category Questions Display Logic
  const getCategoryHighlights = () => {
    const categoryQuestions = job.categoryQuestions || job.category_answers;
    if (!categoryQuestions || Object.keys(categoryQuestions).length === 0) return null;

    const category = job.service_categories?.name || job.serviceCategory?.name || job.category;

    switch (category) {
      case 'Lawn & Landscaping Services':
        return (
          <View style={styles.categoryHighlights}>
            {categoryQuestions.lawn_area && (
              <View style={styles.highlight}>
                <Ionicons name="location" size={12} color="#32D74B" />
                <Text style={styles.highlightText}>{categoryQuestions.lawn_area}</Text>
              </View>
            )}
            {categoryQuestions.property_size && (
              <View style={styles.highlight}>
                <Ionicons name="resize" size={12} color="#007AFF" />
                <Text style={styles.highlightText}>{categoryQuestions.property_size}</Text>
              </View>
            )}
            {categoryQuestions.frequency && (
              <View style={styles.highlight}>
                <Ionicons name="refresh" size={12} color="#FF9F0A" />
                <Text style={styles.highlightText}>{categoryQuestions.frequency}</Text>
              </View>
            )}
            {categoryQuestions.equipment_needed && Array.isArray(categoryQuestions.equipment_needed) && (
              <View style={styles.highlight}>
                <Ionicons name="construct" size={12} color="#5856D6" />
                <Text style={styles.highlightText}>
                  {categoryQuestions.equipment_needed.slice(0, 2).join(', ')}
                  {categoryQuestions.equipment_needed.length > 2 && ` +${categoryQuestions.equipment_needed.length - 2}`}
                </Text>
              </View>
            )}
          </View>
        );
      
      case 'Moving Help / Labor-Only Movers':
        return (
          <View style={styles.categoryHighlights}>
            {categoryQuestions.move_type && (
              <View style={styles.highlight}>
                <Ionicons name="cube" size={12} color="#FF6B35" />
                <Text style={styles.highlightText}>{categoryQuestions.move_type}</Text>
              </View>
            )}
            {categoryQuestions.home_size && (
              <View style={styles.highlight}>
                <Ionicons name="home" size={12} color="#32D74B" />
                <Text style={styles.highlightText}>{categoryQuestions.home_size}</Text>
              </View>
            )}
            {categoryQuestions.stairs && (
              <View style={styles.highlight}>
                <Ionicons name="trending-up" size={12} color="#FF453A" />
                <Text style={styles.highlightText}>Stairs: {categoryQuestions.stairs}</Text>
              </View>
            )}
          </View>
        );

      case 'Home Cleaning':
        return (
          <View style={styles.categoryHighlights}>
            {categoryQuestions.cleaning_type && (
              <View style={styles.highlight}>
                <Ionicons name="sparkles" size={12} color="#5856D6" />
                <Text style={styles.highlightText}>{categoryQuestions.cleaning_type}</Text>
              </View>
            )}
            {categoryQuestions.home_size && (
              <View style={styles.highlight}>
                <Ionicons name="home" size={12} color="#32D74B" />
                <Text style={styles.highlightText}>{categoryQuestions.home_size}</Text>
              </View>
            )}
            {categoryQuestions.frequency && (
              <View style={styles.highlight}>
                <Ionicons name="calendar" size={12} color="#FF9F0A" />
                <Text style={styles.highlightText}>{categoryQuestions.frequency}</Text>
              </View>
            )}
          </View>
        );

      case 'Handyman Services':
        return (
          <View style={styles.categoryHighlights}>
            {categoryQuestions.project_type && (
              <View style={styles.highlight}>
                <Ionicons name="hammer" size={12} color="#FF6B35" />
                <Text style={styles.highlightText}>{categoryQuestions.project_type}</Text>
              </View>
            )}
            {categoryQuestions.urgency && (
              <View style={styles.highlight}>
                <Ionicons name="time" size={12} color="#FF453A" />
                <Text style={styles.highlightText}>{categoryQuestions.urgency}</Text>
              </View>
            )}
            {categoryQuestions.materials_provided && (
              <View style={styles.highlight}>
                <Ionicons name="bag" size={12} color="#007AFF" />
                <Text style={styles.highlightText}>
                  {categoryQuestions.materials_provided === 'yes' ? 'Materials Provided' : 'Bring Materials'}
                </Text>
              </View>
            )}
          </View>
        );

      case 'Painting':
        return (
          <View style={styles.categoryHighlights}>
            {categoryQuestions.paint_type && (
              <View style={styles.highlight}>
                <Ionicons name="brush" size={12} color="#8E4EC6" />
                <Text style={styles.highlightText}>{categoryQuestions.paint_type}</Text>
              </View>
            )}
            {categoryQuestions.rooms && (
              <View style={styles.highlight}>
                <Ionicons name="grid" size={12} color="#32D74B" />
                <Text style={styles.highlightText}>{categoryQuestions.rooms} rooms</Text>
              </View>
            )}
            {categoryQuestions.paint_provided && (
              <View style={styles.highlight}>
                <Ionicons name="color-palette" size={12} color="#FF9F0A" />
                <Text style={styles.highlightText}>
                  {categoryQuestions.paint_provided === 'yes' ? 'Paint Provided' : 'Need Paint'}
                </Text>
              </View>
            )}
          </View>
        );

      case 'Plumbing':
        return (
          <View style={styles.categoryHighlights}>
            {categoryQuestions.issue_type && (
              <View style={styles.highlight}>
                <Ionicons name="water" size={12} color="#007AFF" />
                <Text style={styles.highlightText}>{categoryQuestions.issue_type}</Text>
              </View>
            )}
            {categoryQuestions.urgency && (
              <View style={styles.highlight}>
                <Ionicons name="alert-circle" size={12} color="#FF453A" />
                <Text style={styles.highlightText}>{categoryQuestions.urgency}</Text>
              </View>
            )}
            {categoryQuestions.location && (
              <View style={styles.highlight}>
                <Ionicons name="location" size={12} color="#32D74B" />
                <Text style={styles.highlightText}>{categoryQuestions.location}</Text>
              </View>
            )}
          </View>
        );

      case 'Electrical':
        return (
          <View style={styles.categoryHighlights}>
            {categoryQuestions.service_type && (
              <View style={styles.highlight}>
                <Ionicons name="flash" size={12} color="#FFD60A" />
                <Text style={styles.highlightText}>{categoryQuestions.service_type}</Text>
              </View>
            )}
            {categoryQuestions.permits_needed && (
              <View style={styles.highlight}>
                <Ionicons name="document-text" size={12} color="#5856D6" />
                <Text style={styles.highlightText}>
                  {categoryQuestions.permits_needed === 'yes' ? 'Permits Required' : 'No Permits'}
                </Text>
              </View>
            )}
          </View>
        );

      // Add more categories as needed
      default:
        // Generic category questions display
        const questionEntries = Object.entries(categoryQuestions).slice(0, 3);
        if (questionEntries.length === 0) return null;

        return (
          <View style={styles.categoryHighlights}>
            {questionEntries.map(([key, value]) => (
              <View key={key} style={styles.highlight}>
                <Ionicons name="information-circle" size={12} color="#8E8E93" />
                <Text style={styles.highlightText}>
                  {Array.isArray(value) ? value.join(', ') : value}
                </Text>
              </View>
            ))}
          </View>
        );
    }
  };

  // Swipe gesture handlers
  const handleSwipeComplete = (direction) => {
    setSwiped(true);
    onSwipe?.(job.id, direction === 'right' ? 'apply' : 'skip');
  };

  const panGesture = {
    onUpdate: (event) => {
      if (!swiped && enableSwipe) {
        translateX.value = event.translationX;
      }
    },
    onEnd: (event) => {
      if (swiped || !enableSwipe) return;

      const shouldSwipe = Math.abs(event.translationX) > SWIPE_THRESHOLD;
      
      if (shouldSwipe) {
        const direction = event.translationX > 0 ? 'right' : 'left';
        translateX.value = withSpring(
          direction === 'right' ? screenWidth : -screenWidth,
          { damping: 15 },
          () => runOnJS(handleSwipeComplete)(direction)
        );
      } else {
        translateX.value = withSpring(0);
      }
    }
  };

  // Animation handlers - ✅ FIXED: Using RNAnimated
  const handlePressIn = () => {
    RNAnimated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  };

  const handlePressOut = () => {
    RNAnimated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  };

  // Enhanced job status logic
  const getJobStatusInfo = () => {
    const status = job.status;
    const paymentStatus = job.payment_status;
    const applicationsCount = job.applicationsCount || job.applications?.length || 0;
    
    switch (status) {
      case 'open':
        return {
          color: '#32D74B',
          gradient: ['#32D74B', '#28CD41'],
          text: 'Open',
          subtext: applicationsCount > 0 ? `${applicationsCount} Applications` : 'No Applications Yet',
          icon: 'radio-button-on',
          urgency: job.urgency
        };
      case 'assigned':
        return {
          color: '#007AFF',
          gradient: ['#007AFF', '#0051D5'],
          text: 'Assigned',
          subtext: 'Contractor Assigned',
          icon: 'person-add',
          contractor: job.assigned_contractor || job.contractor
        };
      case 'in_progress':
        return {
          color: '#FF9F0A',
          gradient: ['#FF9F0A', '#FF8C00'],
          text: 'In Progress',
          subtext: 'Work in Progress',
          icon: 'build',
          progress: calculateProgress(job)
        };
      case 'completed':
        return {
          color: paymentStatus === 'pending' ? '#5856D6' : '#007AFF',
          gradient: paymentStatus === 'pending' ? ['#5856D6', '#4A4AE8'] : ['#007AFF', '#0051D5'],
          text: 'Completed',
          subtext: paymentStatus === 'pending' ? 'Review & Pay' : 'Paid',
          icon: paymentStatus === 'pending' ? 'card' : 'checkmark-done',
          needsAction: paymentStatus === 'pending'
        };
      case 'approved':
        return {
          color: '#32D74B',
          gradient: ['#32D74B', '#28CD41'],
          text: 'Approved',
          subtext: 'Completed & Paid',
          icon: 'checkmark-circle',
          completed: true
        };
      case 'cancelled':
        return {
          color: '#FF453A',
          gradient: ['#FF453A', '#FF3B30'],
          text: 'Cancelled',
          subtext: 'Job Cancelled',
          icon: 'close-circle',
          reason: job.cancellation_reason
        };
      default:
        return {
          color: '#8E8E93',
          gradient: ['#8E8E93', '#6D6D70'],
          text: 'Unknown',
          subtext: 'Status Unknown',
          icon: 'help-circle'
        };
    }
  };

  // Calculate job progress
  const calculateProgress = (job) => {
    if (!job.job_checklist_items || job.job_checklist_items.length === 0) {
      return 0;
    }
    
    const completed = job.job_checklist_items.filter(item => item.completed).length;
    return Math.round((completed / job.job_checklist_items.length) * 100);
  };

  // Enhanced urgency indicator
  const getUrgencyInfo = () => {
    switch (job.urgency) {
      case 'urgent':
        return { color: '#FF453A', text: 'URGENT', icon: 'flash' };
      case 'high':
        return { color: '#FF9F0A', text: 'HIGH', icon: 'arrow-up' };
      case 'normal':
        return null;
      case 'low':
        return { color: '#32D74B', text: 'FLEXIBLE', icon: 'time' };
      default:
        return null;
    }
  };

  // Enhanced budget display
  const getBudgetDisplay = () => {
    const budgetMin = job.budget_min || job.budget || 0;
    const budgetMax = job.budget_max || job.budget || 0;
    const totalAmount = job.total_amount;
    const escrowAmount = job.escrow_payments?.[0]?.amount_total;
    
    if (totalAmount && job.status !== 'open') {
      return {
        display: formatCurrency(totalAmount),
        label: job.status === 'completed' || job.status === 'approved' ? 'Final Amount' : 'Project Amount',
        escrow: escrowAmount ? formatCurrency(escrowAmount) : null
      };
    }
    
    if (budgetMin === budgetMax) {
      return {
        display: formatCurrency(budgetMax),
        label: 'Budget',
        range: false
      };
    }
    
    return {
      display: `${formatCurrency(budgetMin)} - ${formatCurrency(budgetMax)}`,
      label: 'Budget Range',
      range: true
    };
  };

  // Enhanced time display
  const getTimeInfo = () => {
    const created = new Date(job.created_at);
    const now = new Date();
    const daysSince = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    
    if (job.completed_at) {
      const completed = new Date(job.completed_at);
      const totalDays = Math.floor((completed - created) / (1000 * 60 * 60 * 24));
      return {
        primary: `${totalDays} days`,
        secondary: 'Completion Time',
        icon: 'checkmark-circle'
      };
    }
    
    if (job.status === 'in_progress') {
      return {
        primary: `${daysSince} days`,
        secondary: 'In Progress',
        icon: 'time',
        alert: daysSince > 14
      };
    }
    
    if (job.preferred_date) {
      const preferred = new Date(job.preferred_date);
      const isOverdue = preferred < now;
      return {
        primary: isOverdue ? 'Overdue' : formatDate(preferred),
        secondary: 'Preferred Date',
        icon: isOverdue ? 'alert-circle' : 'calendar',
        alert: isOverdue
      };
    }
    
    return {
      primary: formatTimeAgo(job.created_at),
      secondary: 'Posted',
      icon: 'time'
    };
  };

  // Enhanced contractor information
  const getContractorInfo = () => {
    const contractor = job.assigned_contractor || job.contractor;
    if (!contractor) return null;
    
    const profile = job.contractor_profiles?.[0] || {};
    
    return {
      name: `${contractor.first_name} ${contractor.last_name}`,
      avatar: contractor.avatar_url,
      business: profile.business_name,
      rating: profile.rating || contractor.rating,
      completedJobs: profile.total_jobs_completed,
      verified: contractor.license_verified || profile.license_verified,
      phone: contractor.phone
    };
  };

  // AI Analysis integration
  const getAIInsights = () => {
    if (!job.ai_job_analyses || job.ai_job_analyses.length === 0) return null;
    
    const analysis = job.ai_job_analyses[0];
    return {
      complexity: analysis.complexity_level,
      confidence: analysis.confidence_score,
      estimatedCost: {
        low: analysis.estimated_cost_low,
        high: analysis.estimated_cost_high,
        suggested: analysis.estimated_cost_suggested
      },
      summary: analysis.summary,
      issues: analysis.detected_issues_count,
      suggestions: analysis.suggestions_count
    };
  };

  // Enhanced location display with privacy
  const getLocationDisplay = () => {
    if (job.location && typeof job.location === 'object') {
      if (job.location.fullAddressVisible && job.location.address) {
        return job.location.address;
      } else {
        const parts = [];
        if (job.location.city) parts.push(job.location.city);
        if (job.location.state) parts.push(job.location.state);
        if (job.location.zipCode) parts.push(job.location.zipCode);
        return parts.join(', ') || 'Location TBD';
      }
    }
    
    if (job.address) {
      return job.address;
    }
    
    const parts = [];
    if (job.city) parts.push(job.city);
    if (job.state) parts.push(job.state);
    if (job.zip_code) parts.push(job.zip_code);
    return parts.join(', ') || 'Location TBD';
  };

  const isAddressHidden = () => {
    return job.location && job.location.fullAddressVisible === false;
  };

  // Video source handling
  const getVideoSource = () => {
    console.log('🎥 Original video URL:', job.video_url);
    
    if (!job.video_url) {
      console.log('❌ No video URL provided');
      return null;
    }

    if (job.video_url.includes('cloudfront.net') || job.video_url.includes('s3.amazonaws.com')) {
      console.log('✅ Using URL as-is:', job.video_url);
      return { uri: job.video_url };
    }
    
    if (job.video_url.includes('mux.com')) {
      console.log('✅ Using m3u8 URL directly:', job.video_url);
      return { uri: job.video_url };
    }
    
    console.log('⚠️ Unknown video URL format, trying as-is:', job.video_url);
    return { uri: job.video_url };
  };

  const handleVideoError = (error) => {
    console.error('Video player error:', error);
    setVideoError(true);
    setIsVideoLoading(false);
  };

  const handleVideoLoad = () => {
    setIsVideoLoading(false);
    setVideoError(false);
  };

  // Get all the info objects
  const statusInfo = getJobStatusInfo();
  const urgencyInfo = getUrgencyInfo();
  const budgetInfo = getBudgetDisplay();
  const timeInfo = getTimeInfo();
  const contractorInfo = getContractorInfo();
  const aiInsights = getAIInsights();
  const videoSource = getVideoSource();

  // Reanimated styles for swipe
  const cardAnimatedStyle = useAnimatedStyle(() => {
    if (!enableSwipe) return {};
    
    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [1, 0.7]
    );

    return {
      transform: [{ translateX: translateX.value }],
      opacity,
    };
  });

  const leftOverlayStyle = useAnimatedStyle(() => {
    if (!enableSwipe) return { opacity: 0 };
    
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0]
    );

    return { opacity };
  });

  const rightOverlayStyle = useAnimatedStyle(() => {
    if (!enableSwipe) return { opacity: 0 };
    
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1]
    );

    return { opacity };
  });

  if (swiped) {
    return null;
  }

  const CardWrapper = enableSwipe ? PanGestureHandler : View;
  // ✅ FIXED: Use proper Animated components based on enableSwipe
  const AnimatedCardView = enableSwipe ? Animated.View : RNAnimated.View;

  const cardProps = enableSwipe ? {
    onGestureEvent: panGesture,
    children: (
      <AnimatedCardView style={[
        styles.cardContainer,
        { transform: [{ scale: scaleAnim }] },
        isHighlighted && styles.highlightedCard,
        style,
        cardAnimatedStyle
      ]}>
        {renderCardContent()}
      </AnimatedCardView>
    )
  } : {
    children: (
      <AnimatedCardView style={[
        styles.cardContainer,
        { transform: [{ scale: scaleAnim }] },
        isHighlighted && styles.highlightedCard,
        style
      ]}>
        {renderCardContent()}
      </AnimatedCardView>
    )
  };

  function renderCardContent() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onPress?.(job)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
      >
        <LinearGradient
          colors={['#FFFFFF', '#F8F9FA']}
          style={styles.cardGradient}
        >
          {/* Status Badge */}
          <View style={styles.statusSection}>
            <LinearGradient
              colors={statusInfo.gradient}
              style={styles.statusBadge}
            >
              <Ionicons name={statusInfo.icon} size={14} color="white" />
              <Text style={styles.statusText}>{statusInfo.text}</Text>
            </LinearGradient>
            
            {urgencyInfo && (
              <View style={[styles.urgencyBadge, { backgroundColor: urgencyInfo.color + '20' }]}>
                <Ionicons name={urgencyInfo.icon} size={12} color={urgencyInfo.color} />
                <Text style={[styles.urgencyText, { color: urgencyInfo.color }]}>
                  {urgencyInfo.text}
                </Text>
              </View>
            )}
          </View>

          {/* Enhanced Video/Image Section */}
          {(job.video_thumbnail_url || job.video_url) && (
            <View style={styles.mediaContainer}>
              {videoSource && !videoError ? (
                <>
                  {isVideoLoading && (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#007AFF" />
                      <Text style={styles.loadingText}>Loading video...</Text>
                    </View>
                  )}
                  
                  <Video
                    source={videoSource}
                    style={styles.mediaImage}
                    resizeMode="cover"
                    shouldPlay={false}
                    isLooping={false}
                    isMuted={true}
                    onLoad={handleVideoLoad}
                    onError={handleVideoError}
                    onLoadStart={() => setIsVideoLoading(true)}
                  />
                  
                  {/* Media Overlay */}
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                    style={styles.mediaOverlay}
                  >
                    <View style={styles.playButton}>
                      <Ionicons name="play" size={20} color="white" />
                    </View>
                    
                    {aiInsights && (
                      <View style={styles.aiAnalysisBadge}>
                        <Ionicons name="brain" size={12} color="#5856D6" />
                        <Text style={styles.aiAnalysisText}>AI Analyzed</Text>
                      </View>
                    )}
                  </LinearGradient>
                </>
              ) : (
                <View style={styles.errorContainer}>
                  <Ionicons name="videocam-off" size={48} color="#ccc" />
                  <Text style={styles.errorText}>
                    {videoError ? 'Video unavailable' : 'No video'}
                  </Text>
                  {job.video_url && (
                    <Text style={styles.debugText}>
                      URL: {job.video_url.substring(0, 50)}...
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Job Content */}
          <View style={styles.jobContent}>
            {/* Title and Description */}
            <View style={styles.titleSection}>
              <Text style={styles.jobTitle} numberOfLines={2}>
                {job.title}
              </Text>
              {job.description && (
                <Text style={styles.jobDescription} numberOfLines={2}>
                  {job.description}
                </Text>
              )}
            </View>

            {/* ✅ NEW: Category Highlights Section */}
            {getCategoryHighlights()}

            {/* Job Details Grid */}
            <View style={styles.detailsGrid}>
              {/* Service Category */}
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Ionicons name="business-outline" size={16} color="#8E8E93" />
                </View>
                <Text style={styles.detailText}>
                  {job.service_categories?.name || job.serviceCategory?.name || job.category || 'General'}
                </Text>
              </View>

              {/* Location */}
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Ionicons name="location-outline" size={16} color="#8E8E93" />
                </View>
                <Text style={styles.detailText}>
                  {getLocationDisplay()}
                </Text>
                {isAddressHidden() && (
                  <Ionicons name="lock-closed" size={12} color="#999" style={{ marginLeft: 4 }} />
                )}
              </View>

              {/* Budget */}
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Ionicons name="cash-outline" size={16} color="#32D74B" />
                </View>
                <View style={styles.budgetContainer}>
                  <Text style={styles.budgetAmount}>{budgetInfo.display}</Text>
                  <Text style={styles.budgetLabel}>{budgetInfo.label}</Text>
                </View>
              </View>

              {/* Time Information */}
              <View style={styles.detailItem}>
                <View style={[styles.detailIcon, timeInfo.alert && styles.alertIcon]}>
                  <Ionicons 
                    name={timeInfo.icon} 
                    size={16} 
                    color={timeInfo.alert ? '#FF453A' : '#8E8E93'} 
                  />
                </View>
                <View>
                  <Text style={[styles.detailText, timeInfo.alert && styles.alertText]}>
                    {timeInfo.primary}
                  </Text>
                  <Text style={styles.detailSubtext}>{timeInfo.secondary}</Text>
                </View>
              </View>
            </View>

            {/* Address Privacy Note */}
            {isAddressHidden() && job.location?.addressNote && (
              <View style={styles.addressNote}>
                <Ionicons name="information-circle-outline" size={14} color="#FF6B35" />
                <Text style={styles.addressNoteText}>{job.location.addressNote}</Text>
              </View>
            )}

            {/* Contractor Section */}
            {contractorInfo && (
              <View style={styles.contractorSection}>
                <View style={styles.contractorInfo}>
                  <Image
                    source={{ uri: contractorInfo.avatar || 'https://via.placeholder.com/40' }}
                    style={styles.contractorAvatar}
                  />
                  <View style={styles.contractorDetails}>
                    <View style={styles.contractorNameRow}>
                      <Text style={styles.contractorName}>{contractorInfo.name}</Text>
                      {contractorInfo.verified && (
                        <Ionicons name="checkmark-circle" size={16} color="#32D74B" />
                      )}
                    </View>
                    {contractorInfo.business && (
                      <Text style={styles.contractorBusiness}>{contractorInfo.business}</Text>
                    )}
                    {contractorInfo.rating && (
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <Text style={styles.ratingText}>
                          {contractorInfo.rating.toFixed(1)}
                        </Text>
                        {contractorInfo.completedJobs && (
                          <Text style={styles.completedJobs}>
                            • {contractorInfo.completedJobs} jobs
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.contractorActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onQuickAction?.('message', job)}
                  >
                    <Ionicons name="chatbubble" size={16} color="#007AFF" />
                  </TouchableOpacity>
                  
                  {contractorInfo.phone && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => onQuickAction?.('call', job)}
                    >
                      <Ionicons name="call" size={16} color="#32D74B" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* Homeowner Section (for contractor view) */}
            {userType === 'contractor' && (
              <View style={styles.homeownerContainer}>
                <Image
                  source={{ 
                    uri: job.profiles?.avatar_url || 'https://via.placeholder.com/32/007AFF/white?text=H' 
                  }}
                  style={styles.avatar}
                />
                <Text style={styles.homeownerName}>
                  {job.profiles?.full_name || 'Homeowner'}
                </Text>
                
                {job.urgency && job.urgency !== 'normal' && (
                  <View style={[styles.urgencyBadge, styles[`urgency${job.urgency}`]]}>
                    <Text style={styles.urgencyText}>
                      {job.urgency.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Progress Section for In-Progress Jobs */}
            {job.status === 'in_progress' && statusInfo.progress !== undefined && (
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Project Progress</Text>
                  <Text style={styles.progressPercent}>{statusInfo.progress}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={['#FF9F0A', '#FF8C00']}
                    style={[styles.progressFill, { width: `${statusInfo.progress}%` }]}
                  />
                </View>
              </View>
            )}

            {/* AI Insights Section */}
            {aiInsights && (
              <View style={styles.aiInsightsSection}>
                <View style={styles.aiHeader}>
                  <Ionicons name="brain" size={16} color="#5856D6" />
                  <Text style={styles.aiHeaderText}>AI Analysis</Text>
                  <View style={styles.confidenceBadge}>
                    <Text style={styles.confidenceText}>
                      {Math.round(aiInsights.confidence * 100)}%
                    </Text>
                  </View>
                </View>
                
                <View style={styles.aiMetrics}>
                  <View style={styles.aiMetric}>
                    <Text style={styles.aiMetricLabel}>Complexity</Text>
                    <Text style={styles.aiMetricValue}>
                      {aiInsights.complexity?.charAt(0).toUpperCase() + aiInsights.complexity?.slice(1)}
                    </Text>
                  </View>
                  
                  {aiInsights.estimatedCost.suggested && (
                    <View style={styles.aiMetric}>
                      <Text style={styles.aiMetricLabel}>AI Estimate</Text>
                      <Text style={styles.aiMetricValue}>
                        {formatCurrency(aiInsights.estimatedCost.suggested)}
                      </Text>
                    </View>
                  )}
                  
                  {(aiInsights.issues > 0 || aiInsights.suggestions > 0) && (
                    <View style={styles.aiMetric}>
                      <Text style={styles.aiMetricLabel}>Insights</Text>
                      <Text style={styles.aiMetricValue}>
                        {aiInsights.issues} issues • {aiInsights.suggestions} tips
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Action Section */}
            <View style={styles.actionSection}>
              <View style={styles.statusInfo}>
                <Ionicons name={statusInfo.icon} size={20} color={statusInfo.color} />
                <Text style={[styles.statusSubtext, { color: statusInfo.color }]}>
                  {statusInfo.subtext}
                </Text>
              </View>

              {/* Quick Actions based on status */}
              <View style={styles.quickActions}>
                {job.status === 'open' && job.applicationsCount > 0 && (
                  <TouchableOpacity
                    style={[styles.quickActionButton, { backgroundColor: '#32D74B20' }]}
                    onPress={() => onQuickAction?.('viewApplications', job)}
                  >
                    <Text style={[styles.quickActionText, { color: '#32D74B' }]}>
                      View {job.applicationsCount} Applications
                    </Text>
                  </TouchableOpacity>
                )}

                {job.status === 'completed' && job.payment_status === 'pending' && (
                  <TouchableOpacity
                    style={[styles.quickActionButton, { backgroundColor: '#5856D620' }]}
                    onPress={() => onQuickAction?.('reviewPayment', job)}
                  >
                    <Text style={[styles.quickActionText, { color: '#5856D6' }]}>
                      Review & Pay
                    </Text>
                  </TouchableOpacity>
                )}

                {(job.status === 'in_progress' || job.status === 'assigned') && (
                  <TouchableOpacity
                    style={[styles.quickActionButton, { backgroundColor: '#007AFF20' }]}
                    onPress={() => onQuickAction?.('viewProgress', job)}
                  >
                    <Text style={[styles.quickActionText, { color: '#007AFF' }]}>
                      View Progress
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity style={styles.chevronButton}>
                <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Swipe Overlays (only if swipe enabled) */}
        {enableSwipe && (
          <>
            <Animated.View 
              style={[styles.swipeOverlay, styles.skipOverlay, leftOverlayStyle]}
            >
              <Ionicons name="close" size={48} color="white" />
              <Text style={styles.skipText}>SKIP</Text>
            </Animated.View>

            <Animated.View 
              style={[styles.swipeOverlay, styles.applyOverlay, rightOverlayStyle]}
            >
              <Ionicons name="checkmark" size={48} color="white" />
              <Text style={styles.applyText}>APPLY</Text>
            </Animated.View>
          </>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <CardWrapper {...cardProps} />
  );
};

// Utility Functions
const formatCurrency = (amount) => {
  if (!amount || isNaN(amount)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date));
};

// Enhanced Styles
const styles = StyleSheet.create({
  // Card Container
  cardContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  highlightedCard: {
    borderWidth: 2,
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: 20,
  },

  // Status Section
  statusSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 0,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: '700',
  },

  // ✅ NEW: Category Highlights Styles
  categoryHighlights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  highlight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3F2FD',
    gap: 4,
  },
  highlightText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976D2',
  },

  // Media Section
  mediaContainer: {
    position: 'relative',
    height: 200,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  debugText: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  mediaOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiAnalysisBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  aiAnalysisText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#5856D6',
  },

  // Job Content
  jobContent: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 16,
  },
  jobTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
    lineHeight: 28,
    marginBottom: 8,
  },
  jobDescription: {
    fontSize: 15,
    color: '#8E8E93',
    lineHeight: 22,
  },

  // Details Grid
  detailsGrid: {
    marginBottom: 20,
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertIcon: {
    backgroundColor: '#FF453A20',
    borderRadius: 12,
  },
  detailText: {
    fontSize: 15,
    color: '#1C1C1E',
    fontWeight: '500',
    flex: 1,
  },
  alertText: {
    color: '#FF453A',
  },
  detailSubtext: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  budgetContainer: {
    flex: 1,
  },
  budgetAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#32D74B',
  },
  budgetLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },

  // Address Privacy Note
  addressNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#FFF4E6',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFE4B5',
  },
  addressNoteText: {
    fontSize: 12,
    color: '#B8860B',
    marginLeft: 4,
    flex: 1,
  },

  // Contractor Section
  contractorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  contractorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contractorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  contractorDetails: {
    flex: 1,
  },
  contractorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  contractorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  contractorBusiness: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  completedJobs: {
    fontSize: 12,
    color: '#8E8E93',
  },
  contractorActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Homeowner Section (for contractor view)
  homeownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  homeownerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  urgencyurgent: {
    backgroundColor: '#FF3B30',
  },
  urgencyhigh: {
    backgroundColor: '#FF9500',
  },

  // Progress Section
  progressSection: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF9F0A',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },

  // AI Insights Section
  aiInsightsSection: {
    backgroundColor: '#F4F3FF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  aiHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
  },
  confidenceBadge: {
    backgroundColor: '#5856D6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  aiMetrics: {
    flexDirection: 'row',
    gap: 16,
  },
  aiMetric: {
    flex: 1,
  },
  aiMetricLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  aiMetricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },

  // Action Section
  actionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 16,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  statusSubtext: {
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    marginRight: 12,
  },
  quickActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chevronButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Swipe Overlays
  swipeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  skipOverlay: {
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
  },
  applyOverlay: {
    backgroundColor: 'rgba(52, 199, 89, 0.9)',
  },
  skipText: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    marginTop: 8,
    transform: [{ rotate: '-15deg' }],
  },
  applyText: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    marginTop: 8,
    transform: [{ rotate: '15deg' }],
  },
});

export default JobCard;