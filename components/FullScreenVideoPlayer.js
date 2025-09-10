// Updated FullScreenVideoPlayer.js with proper ref forwarding for video control
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
  Text,
  PanResponder,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// ✅ NEW: Import JobDetailNavigator for smart routing
import { JobDetailNavigator } from '../navigation/JobDetailNavigator';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// ✅ UPDATED: Forward ref to expose video control methods
const FullScreenVideoPlayer = forwardRef(({ 
  videoUrl, 
  thumbnailUrl,
  isActive = false,
  onVideoPress,
  onHomePress,
  onInfoPress,
  onMenuPress,
  onBriefcasePress,
  onSwipeUp,
  onSwipeDown,
  style,
  muted = false,
  showMuteButton = true,
  showHomeButton = true,
  showInfoButton = true,
  showMenuButton = true,
  showBriefcaseButton = true,
  enableSwipeNavigation = true,
  // ✅ NEW: Add job data for smart navigation
  job = null,
  jobId = null,
}, ref) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [swipeDirection, setSwipeDirection] = useState(null);
  
  // Swipe state tracking
  const swipeState = useRef({
    isGesturing: false,
    startY: 0,
    totalDy: 0,
    velocity: 0,
    startTime: 0,
  });

  // Video URL processing
  const getValidVideoUrl = (url) => {
    if (!url) return null;

    try {
      // Handle S3/CloudFront URLs
      if (url.includes('cloudfront.net') || url.includes('s3.amazonaws.com')) {
        return url;
      }

      // Handle Mux URLs
      if (url.includes('mux.com')) {
        if (url.includes('.m3u8')) {
          return url;
        }
        
        if (url.includes('stream.mux.com')) {
          const urlParts = url.split('/');
          const lastPart = urlParts[urlParts.length - 1];
          const playbackId = lastPart.split('.')[0];
          
          if (playbackId && playbackId.length > 10) {
            return `https://stream.mux.com/${playbackId}.m3u8`;
          } else {
            return null;
          }
        }
      }

      // Handle direct video URLs
      if (url.startsWith('http') && (url.includes('.mp4') || url.includes('.m3u8') || url.includes('.mov'))) {
        return url;
      }

      return null;
      
    } catch (error) {
      return null;
    }
  };

  const validVideoUrl = getValidVideoUrl(videoUrl);

  // Video player setup
  const player = useVideoPlayer(validVideoUrl, (player) => {
    if (player) {
      player.loop = true;
      player.muted = isMuted;
    }
  });

  // ✅ NEW: Expose video control methods through ref
  useImperativeHandle(ref, () => ({
    pauseAsync: async () => {
      try {
        if (player) {
          player.pause();
          console.log('🎬 Video paused via ref');
        }
      } catch (error) {
        console.error('Video pause error:', error);
      }
    },
    setPositionAsync: async (position = 0) => {
      try {
        if (player) {
          player.currentTime = position;
          console.log('🎬 Video position reset via ref');
        }
      } catch (error) {
        console.error('Video position reset error:', error);
      }
    },
    stopVideo: async () => {
      try {
        if (player) {
          // ✅ NEW: Multiple stop methods for better reliability
          player.pause();
          player.muted = true; // Immediately mute
          player.currentTime = 0;
          player.volume = 0; // Set volume to 0 as backup
          console.log('🎬 Video stopped completely via ref');
        }
      } catch (error) {
        console.error('Video stop error:', error);
      }
    },
    muteVideo: async () => {
      try {
        if (player) {
          player.muted = true;
          player.volume = 0;
          console.log('🎬 Video muted immediately');
        }
      } catch (error) {
        console.error('Video mute error:', error);
      }
    }
  }), [player]);

  // PanResponder for swipe detection
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => enableSwipeNavigation,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (!enableSwipeNavigation) return false;
        
        const { dx, dy } = gestureState;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);
        
        return absY > absX && absY > 10;
      },
      
      onPanResponderGrant: (evt) => {
        const now = Date.now();
        swipeState.current = {
          isGesturing: true,
          startY: evt.nativeEvent.pageY,
          totalDy: 0,
          velocity: 0,
          startTime: now,
        };
        setSwipeDirection(null);
      },
      
      onPanResponderMove: (evt, gestureState) => {
        if (!enableSwipeNavigation || !swipeState.current.isGesturing) return;
        
        const { dy } = gestureState;
        swipeState.current.totalDy = dy;
        
        if (Math.abs(dy) > 30) {
          const direction = dy < 0 ? 'up' : 'down';
          if (swipeDirection !== direction) {
            setSwipeDirection(direction);
          }
        }
      },
      
      onPanResponderRelease: (evt, gestureState) => {
        if (!enableSwipeNavigation || !swipeState.current.isGesturing) {
          swipeState.current.isGesturing = false;
          setSwipeDirection(null);
          return;
        }
        
        const { dy, vy } = gestureState;
        const minDistance = 60;
        const minVelocity = 0.3;
        
        const distance = Math.abs(dy);
        const velocity = Math.abs(vy);
        
        if (distance > minDistance || velocity > minVelocity) {
          if (dy < 0) {
            // Swiped up
            if (onSwipeUp) {
              onSwipeUp();
            }
          } else {
            // Swiped down
            if (onSwipeDown) {
              onSwipeDown();
            }
          }
        }
        
        swipeState.current.isGesturing = false;
        setSwipeDirection(null);
      },
      
      onPanResponderTerminate: () => {
        swipeState.current.isGesturing = false;
        setSwipeDirection(null);
      },
    })
  ).current;

  // Handle active state changes
  useEffect(() => {
    if (!player) return;

    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  // Update player mute state
  useEffect(() => {
    if (player) {
      player.muted = isMuted;
    }
  }, [isMuted, player]);

  // Video player status listener
  useEffect(() => {
    if (!player) return;

    const subscription = player.addListener('statusChange', (status) => {
      if (status.status === 'readyToPlay') {
        setIsLoading(false);
        setHasError(false);
      } else if (status.status === 'error') {
        setHasError(true);
        setIsLoading(false);
      } else if (status.status === 'loading') {
        setIsLoading(true);
        setHasError(false);
      }
    });

    return () => {
      subscription?.remove();
    };
  }, [player, validVideoUrl]);

  // Video press handler
  const handleVideoPress = () => {
    if (swipeState.current.isGesturing) {
      return;
    }
    
    if (onVideoPress) {
      onVideoPress();
    } else if (hasError) {
      setHasError(false);
      setIsLoading(true);
      if (player && validVideoUrl) {
        player.replace(validVideoUrl);
      }
    } else {
      toggleMute();
    }
  };

  const toggleMute = () => {
    try {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      
      setShowControls(true);
      setTimeout(() => setShowControls(false), 1500);
    } catch (error) {
      console.error('Video mute toggle error:', error);
    }
  };

  // Button handlers
  const handleHomePress = () => {
    try {
      if (onHomePress) {
        onHomePress();
      } else {
        navigation.navigate('Home', { screen: 'ProStatisticsMain' });
      }
    } catch (error) {
      console.error('❌ Home navigation failed:', error);
      navigation.goBack();
    }
  };

  const handleMenuPress = () => {
    try {
      if (onMenuPress) {
        onMenuPress();
      }
    } catch (error) {
      console.error('❌ Menu navigation failed:', error);
    }
  };

  const handleBriefcasePress = () => {
    try {
      if (onBriefcasePress) {
        onBriefcasePress();
      }
    } catch (error) {
      console.error('❌ Briefcase navigation failed:', error);
    }
  };

  /**
   * ✅ UPDATED: Enhanced info press handler with smart navigation
   */
  const handleInfoPress = async () => {
    try {
      if (onInfoPress) {
        // Use custom handler if provided
        onInfoPress();
        return;
      }

      // ✅ NEW: Use smart navigation if job data is available
      if (job || jobId) {
        console.log('🎯 FullScreenVideoPlayer: Using smart navigation for job:', jobId || job?.id);
        
        // Prepare job data for navigation
        const jobData = job || { id: jobId };
        
        // Use JobDetailNavigator for smart routing
        await JobDetailNavigator.navigateToJobDetail(navigation, {
          job: jobData,
          jobId: jobData.id,
          fromFullScreenVideo: true
        });
      } else {
        // ✅ FALLBACK: Navigate to a default screen if no job data
        console.log('⚠️ FullScreenVideoPlayer: No job data available, using fallback navigation');
        navigation.goBack();
      }
    } catch (error) {
      console.error('❌ Info navigation failed:', error);
      // Fallback navigation on error
      navigation.goBack();
    }
  };

  // Error state
  if (!validVideoUrl || hasError) {
    return (
      <View style={[styles.container, style]} {...(enableSwipeNavigation ? panResponder.panHandlers : {})}>
        {/* Top Row Buttons */}
        {showHomeButton && (
          <TouchableOpacity style={styles.homeButton} onPress={handleHomePress}>
            <View style={styles.buttonBackground}>
              <Ionicons name="home" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}

        {showMuteButton && (
          <TouchableOpacity style={styles.muteButton} onPress={toggleMute}>
            <View style={styles.buttonBackground}>
              <Ionicons name="volume-mute" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}

        {showMenuButton && (
          <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
            <View style={styles.buttonBackground}>
              <Ionicons name="menu" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}

        {/* Error content */}
        {thumbnailUrl ? (
          <TouchableOpacity 
            style={styles.videoTouchArea}
            onPress={handleVideoPress}
            activeOpacity={1}
          >
            <Image 
              source={{ uri: thumbnailUrl }}
              style={styles.video}
              resizeMode="cover"
            />
            <View style={styles.errorOverlay}>
              <View style={styles.playButton}>
                <Ionicons name={hasError ? "refresh" : "play"} size={32} color="white" />
              </View>
              <Text style={styles.errorText}>
                {hasError ? 'Video unavailable - Tap to retry' : 'Tap to play video'}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.errorContainer}>
            <Ionicons name="videocam-off" size={48} color="#666" />
            <Text style={styles.errorText}>No video available</Text>
          </View>
        )}

        {/* ✅ NEW: Show info button even in error state */}
        {showInfoButton && (job || jobId) && (
          <TouchableOpacity 
            style={styles.infoButtonRight}
            onPress={handleInfoPress}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <View style={styles.buttonBackground}>
              <Ionicons name="information-circle" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}

        {showBriefcaseButton && (
          <TouchableOpacity 
            style={styles.briefcaseButton}
            onPress={handleBriefcasePress}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <View style={styles.buttonBackground}>
              <Ionicons name="briefcase" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {/* Swipe overlay */}
      {enableSwipeNavigation && (
        <View 
          style={styles.swipeOverlay} 
          {...panResponder.panHandlers}
        />
      )}
      
      <TouchableOpacity 
        style={styles.videoTouchArea}
        onPress={handleVideoPress}
        activeOpacity={1}
      >
        <VideoView
          player={player}
          style={styles.video}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          contentFit="cover"
        />

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Top Row Buttons */}
      {showHomeButton && (
        <TouchableOpacity style={styles.homeButton} onPress={handleHomePress}>
          <View style={styles.buttonBackground}>
            <Ionicons name="home" size={20} color="white" />
          </View>
        </TouchableOpacity>
      )}

      {showMuteButton && (
        <TouchableOpacity 
          style={styles.muteButton}
          onPress={toggleMute}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <View style={styles.buttonBackground}>
            <Ionicons 
              name={isMuted ? "volume-mute" : "volume-high"} 
              size={20} 
              color="white" 
            />
          </View>
        </TouchableOpacity>
      )}

      {showMenuButton && (
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={handleMenuPress}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <View style={styles.buttonBackground}>
            <Ionicons name="menu" size={20} color="white" />
          </View>
        </TouchableOpacity>
      )}

      {/* Middle Right Buttons */}
      {showInfoButton && (
        <TouchableOpacity 
          style={styles.infoButtonRight}
          onPress={handleInfoPress}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <View style={[
            styles.buttonBackground,
            // ✅ NEW: Highlight info button if job data is available
            (job || jobId) && styles.buttonBackgroundActive
          ]}>
            <Ionicons name="information-circle" size={20} color="white" />
          </View>
        </TouchableOpacity>
      )}

      {showBriefcaseButton && (
        <TouchableOpacity 
          style={styles.briefcaseButton}
          onPress={handleBriefcasePress}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <View style={styles.buttonBackground}>
            <Ionicons name="briefcase" size={20} color="white" />
          </View>
        </TouchableOpacity>
      )}

      {/* Swipe direction indicator */}
      {enableSwipeNavigation && swipeDirection && (
        <View style={styles.swipeDirectionIndicator}>
          <View style={styles.swipeDirectionBackground}>
            <Ionicons 
              name={swipeDirection === 'up' ? 'arrow-up' : 'arrow-down'} 
              size={32} 
              color="white" 
            />
            <Text style={styles.swipeDirectionText}>
              {swipeDirection === 'up' ? 'Previous Job' : 'Next Job'}
            </Text>
          </View>
        </View>
      )}

      {/* Mute indicator */}
      {showControls && (
        <View style={styles.muteIndicator}>
          <View style={styles.muteIndicatorBackground}>
            <Ionicons 
              name={isMuted ? "volume-mute" : "volume-high"} 
              size={24} 
              color="white" 
            />
            <Text style={styles.muteIndicatorText}>
              {isMuted ? 'Muted' : 'Unmuted'}
            </Text>
          </View>
        </View>
      )}

      {/* ✅ NEW: Job info indicator */}
      {(job || jobId) && (
        <View style={styles.jobInfoIndicator}>
          <View style={styles.jobInfoBackground}>
            <Ionicons name="information-circle" size={16} color="white" />
            <Text style={styles.jobInfoText}>Tap ⓘ for job details</Text>
          </View>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  swipeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  videoTouchArea: {
    flex: 1,
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  
  // ✅ REPOSITIONED: Home and mute buttons aligned and lowered
  homeButton: {
    position: 'absolute',
    top: 48, // Moved down half inch (from 16 to 48)
    left: 16,
    zIndex: 20,
  },
  muteButton: {
    position: 'absolute',
    top: 48, // Moved down half inch (from 16 to 48) 
    right: 16, // Moved to match left distance (from 70 to 16)
    zIndex: 20,
  },
  menuButton: {
    position: 'absolute',
    top: 48, // Moved down to match other buttons
    right: 70, // Moved left to make room for mute button
    zIndex: 20,
  },
  infoButtonRight: {
    position: 'absolute',
    top: '45%',
    right: 16,
    zIndex: 20,
  },
  briefcaseButton: {
    position: 'absolute',
    top: '35%',
    right: 16,
    zIndex: 20,
  },
  buttonBackground: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  // ✅ NEW: Active button style for info button
  buttonBackgroundActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.8)', // Orange background when job data available
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  
  // Mute indicator
  muteIndicator: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 15,
  },
  muteIndicatorBackground: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  muteIndicatorText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Swipe direction indicator
  swipeDirectionIndicator: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 25,
    marginTop: -40,
  },
  swipeDirectionBackground: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
  },
  swipeDirectionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },

  // ✅ NEW: Job info indicator
  jobInfoIndicator: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 15,
  },
  jobInfoBackground: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  jobInfoText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default FullScreenVideoPlayer;