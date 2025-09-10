// components/VideoThumbnail.js - ✅ FIXED for expo-video (not expo-av)
import React, { useState, useRef, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
// ✅ FIXED: Use VideoView from expo-video instead of Video from expo-av
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';

export default function VideoThumbnail({ 
  videoUrl, 
  thumbnailUrl, 
  style, 
  onPress,
  showPlayButton = true,
  autoPlay = false,
  showMuteButton = true,
  initialMuted = true,
  // ✅ NEW: Accept external isPlaying prop
  isPlaying: externalIsPlaying,
  controls = true,
  resizeMode = "cover",
  loop = false,
  muted = false
}) {
  const [imageError, setImageError] = useState(false);
  // ✅ FIXED: Use external isPlaying if provided, otherwise use internal state
  const [internalIsPlaying, setInternalIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(initialMuted || muted);
  const [showVideo, setShowVideo] = useState(autoPlay);
  const [videoEnded, setVideoEnded] = useState(false); // ✅ NEW: Track if video has ended

  // ✅ FIXED: Force video recreation by changing the source
  const [videoKey, setVideoKey] = useState(0);
  
  const getVideoSourceWithKey = () => {
    const baseSource = getVideoSource();
    if (!baseSource) return null;
    
    // Add key parameter to force recreation
    const separator = baseSource.uri.includes('?') ? '&' : '?';
    return {
      uri: `${baseSource.uri}${separator}key=${videoKey}`
    };
  };
  
  const player = useVideoPlayer(getVideoSourceWithKey()?.uri || '', (player) => {
    player.loop = loop;
    player.muted = isMuted;
  });

  // ✅ NEW: Determine which playing state to use
  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;

  // ✅ NEW: Sync internal state with external changes
  useEffect(() => {
    if (externalIsPlaying !== undefined) {
      console.log('🎥 VideoThumbnail: External isPlaying changed to:', externalIsPlaying);
      setShowVideo(externalIsPlaying || showVideo);
      
      // ✅ NEW: Reset video ended state when starting to play
      if (externalIsPlaying) {
        setVideoEnded(false);
      }
      
      // Control video playback based on external state
      if (player && showVideo) {
        if (externalIsPlaying) {
          player.play();
        } else {
          player.pause();
        }
      }
    }
  }, [externalIsPlaying, player, showVideo]);

  // ✅ FIXED: Update player state when isPlaying changes
  useEffect(() => {
    if (player) {
      if (isPlaying) {
        player.play();
      } else {
        player.pause();
      }
    }
  }, [isPlaying, player]);

  // ✅ FIXED: Update muted state
  useEffect(() => {
    if (player) {
      player.muted = isMuted;
    }
  }, [isMuted, player]);

  // ✅ NEW: Enhanced logging for debugging
  useEffect(() => {
    console.log('🎥 VideoThumbnail: Props update:', {
      videoUrl: videoUrl ? `${videoUrl.substring(0, 50)}...` : 'none',
      externalIsPlaying,
      internalIsPlaying,
      finalIsPlaying: isPlaying,
      showVideo,
      showPlayButton
    });
  }, [externalIsPlaying, internalIsPlaying, isPlaying, showVideo, showPlayButton]);

  // ✅ FIXED: Monitor video playback status for end detection (with proper state management)
  useEffect(() => {
    if (player && showVideo && isPlaying && !videoEnded) {
      const checkVideoStatus = () => {
        // Only check if video is actually playing and hasn't already ended
        if (player.currentTime > 0 && player.duration > 0 && !videoEnded) {
          const timeRemaining = player.duration - player.currentTime;
          
          if (timeRemaining < 0.1) { // Video essentially finished
            console.log('🎥 VideoThumbnail: Video finished playing (detected via time check)');
            setVideoEnded(true);
            
            if (externalIsPlaying !== undefined && onPress) {
              // If externally controlled, notify parent that video ended
              onPress();
            } else {
              // If internally controlled, stop playback
              setInternalIsPlaying(false);
              if (!loop) {
                setShowVideo(false);
              }
            }
          }
        }
      };

      // Only check video status when actually playing
      const interval = setInterval(checkVideoStatus, 1000); // Reduced frequency to 1 second

      return () => {
        clearInterval(interval);
      };
    }
  }, [player, showVideo, isPlaying, videoEnded, externalIsPlaying, onPress, loop]);

  // ✅ FIXED: Generate thumbnail URL with better error handling
  const getThumbnailUrl = () => {
    if (thumbnailUrl) {
      console.log('✅ VideoThumbnail: Using provided thumbnail URL');
      return thumbnailUrl;
    }
    
    // ✅ OPTIMIZATION: Skip thumbnail generation for now to avoid loading issues
    // Just use a reliable placeholder immediately
    if (videoUrl) {
      console.log('🎯 VideoThumbnail: Using ProSwipe placeholder (skipping thumbnail generation)');
      return 'https://via.placeholder.com/400x225/FF6B35/ffffff?text=ProSwipe+Video';
    }
    
    // ✅ FALLBACK: Default placeholder
    console.log('⚠️ VideoThumbnail: Using default placeholder');
    return 'https://via.placeholder.com/400x225/FF6B35/ffffff?text=ProSwipe+Video';
  };

  const handleImageError = () => {
    console.log('🖼️ VideoThumbnail: Thumbnail image failed to load, using fallback');
    setImageError(true);
  };

  // ✅ FIXED: Handle video press - prioritize external onPress
  const handleVideoPress = () => {
    console.log('🎥 VideoThumbnail: Video pressed, onPress available:', !!onPress);
    
    if (onPress) {
      // If external onPress is provided, use it (JobDetailScreen controls playback)
      onPress();
    } else {
      // If no external onPress, use internal playbook control
      togglePlayPause();
    }
  };

  // ✅ FIXED: Handle refresh button press (recreate video component with new key)
  const handleRefreshPress = () => {
    console.log('🔄 VideoThumbnail: Refresh button pressed - recreating video');
    
    try {
      // Step 1: Reset all states and recreate video player
      setVideoEnded(false);
      setVideoKey(prev => prev + 1); // This will recreate the video player
      
      // Step 2: Brief delay then start playing
      setTimeout(() => {
        console.log('🔄 VideoThumbnail: Video recreated, starting playback');
        setShowVideo(true);
        
        if (externalIsPlaying !== undefined && onPress) {
          // If externally controlled, notify parent
          console.log('🔄 VideoThumbnail: Notifying parent to start playing');
          onPress();
        } else {
          // If internally controlled, start playing
          console.log('🔄 VideoThumbnail: Starting internal playback');
          setInternalIsPlaying(true);
        }
      }, 200);
      
    } catch (error) {
      console.error('🔄 VideoThumbnail: Failed to recreate video:', error);
    }
  };

  // ✅ FIXED: Toggle play/pause functionality (for internal control only)
  const togglePlayPause = async () => {
    if (!player) return;

    try {
      if (internalIsPlaying) {
        player.pause();
        setInternalIsPlaying(false);
      } else {
        setShowVideo(true);
        player.play();
        setInternalIsPlaying(true);
      }
    } catch (error) {
      console.error('🎥 VideoThumbnail: Video play/pause error:', error);
    }
  };

  // Toggle mute/unmute functionality
  const toggleMute = () => {
    try {
      const newMutedState = !isMuted;
      player.muted = newMutedState;
      setIsMuted(newMutedState);
    } catch (error) {
      console.error('🎥 VideoThumbnail: Video mute toggle error:', error);
    }
  };

  // ✅ FIXED: Get video source with ProSwipe S3 pattern recognition
  function getVideoSource() {
    if (!videoUrl) {
      console.log('❌ VideoThumbnail: No video URL provided');
      return null;
    }

    console.log('🎥 VideoThumbnail: Processing video URL:', videoUrl.substring(0, 100) + '...');
    console.log('🎥 VideoThumbnail: Full URL length:', videoUrl.length);

    // ✅ FIXED: Detect ProSwipe S3 truncated URLs
    if (videoUrl.includes('proswipe-videos-prod.s3') && !videoUrl.includes('.mp4')) {
      console.log('❌ VideoThumbnail: Detected truncated ProSwipe S3 URL - missing file extension');
      return null;
    }

    // Generic S3 truncated URLs
    if (videoUrl.includes('s3.amazonaws.com') && !videoUrl.includes('.mp4')) {
      console.log('❌ VideoThumbnail: Detected truncated S3 URL - missing file extension');
      return null;
    }

    // ✅ FIXED: Detect incomplete URLs (ProSwipe URLs should be longer)
    if (videoUrl.length < 120 && videoUrl.includes('amazonaws.com')) {
      console.log('❌ VideoThumbnail: URL appears truncated (too short for ProSwipe S3)');
      return null;
    }

    // Check for expired presigned URLs
    if (videoUrl.includes('?X-Amz-') && videoUrl.includes('Expires=')) {
      const urlParams = new URLSearchParams(videoUrl.split('?')[1]);
      const expires = urlParams.get('Expires');
      if (expires) {
        const expiryDate = new Date(parseInt(expires) * 1000);
        const now = new Date();
        if (expiryDate < now) {
          console.log('❌ VideoThumbnail: Presigned URL expired at:', expiryDate);
          return null;
        }
        console.log('✅ VideoThumbnail: Presigned URL valid until:', expiryDate);
      }
    }

    // ✅ FIXED: Handle ProSwipe S3 URLs (your primary pattern)
    if (videoUrl.includes('proswipe-videos-prod.s3') && videoUrl.includes('.mp4')) {
      console.log('✅ VideoThumbnail: Using ProSwipe S3 video URL (recognized pattern)');
      return { uri: videoUrl };
    }

    // Handle CloudFront URLs (working pattern)
    if (videoUrl.includes('cloudfront.net')) {
      console.log('✅ VideoThumbnail: Using CloudFront video (good pattern)');
      return { uri: videoUrl };
    }

    // Handle generic complete S3 URLs
    if (videoUrl.includes('s3.amazonaws.com') && videoUrl.includes('.mp4')) {
      console.log('✅ VideoThumbnail: Using complete S3 video URL');
      return { uri: videoUrl };
    }
    
    // Handle legacy Mux URLs
    if (videoUrl.includes('mux.com')) {
      console.log('✅ VideoThumbnail: Using Mux video');
      return { uri: videoUrl };
    }
    
    // ✅ FIXED: This should rarely happen now
    console.log('⚠️ VideoThumbnail: Using unrecognized video URL pattern - may not work');
    return { uri: videoUrl };
  }

  const videoSource = getVideoSourceWithKey();

  // ✅ FIXED: Show video when playing OR when showVideo is true
  const shouldShowVideo = (isPlaying || showVideo) && videoSource;

  return (
    <View style={[styles.container, style]}>
      {/* ✅ FIXED: Video Player (hidden when video ends to avoid native end controls) */}
      {shouldShowVideo && !videoEnded ? (
        <TouchableOpacity 
          style={styles.videoContainer}
          onPress={handleVideoPress}
          activeOpacity={1}
        >
          {/* ✅ FIXED: Use VideoView from expo-video with proper controls handling */}
          <VideoView
            style={styles.video}
            player={player}
            contentFit={resizeMode}
            allowsFullscreen={false}
            allowsPictureInPicture={false}
            // ✅ FIXED: Always hide native controls to show custom replay button
            showsTimecodes={false}
            nativeControls={false}
          />

          {/* ✅ FIXED: Video Controls Overlay (only show if not using native controls) */}
          {!controls && (
            <View style={styles.videoControls}>
              {/* Mute/Unmute Button */}
              {showMuteButton && (
                <TouchableOpacity 
                  style={styles.muteButton}
                  onPress={toggleMute}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <View style={styles.muteButtonBackground}>
                    <Ionicons 
                      name={isMuted ? "volume-mute" : "volume-high"} 
                      size={16} 
                      color="white" 
                    />
                  </View>
                </TouchableOpacity>
              )}

              {/* Play/Pause Button (shown when paused) */}
              {!isPlaying && (
                <View style={styles.playButtonContainer}>
                  <View style={styles.playButton}>
                    <Ionicons name="play" size={32} color="white" />
                  </View>
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>
      ) : videoEnded && videoSource ? (
        // ✅ FIXED: Show only refresh overlay when video ends (no video component)
        <TouchableOpacity 
          style={styles.videoContainer}
          onPress={handleRefreshPress}
          activeOpacity={0.8}
        >
          {/* Static final frame background */}
          <View style={styles.videoEndedBackground} />
          
          {/* Custom refresh overlay */}
          <View style={styles.refreshOverlay}>
            <View style={styles.refreshButtonContainer}>
              <View style={styles.refreshButton}>
                <Ionicons name="refresh" size={32} color="white" />
              </View>
              <Text style={styles.refreshText}>Replay Video</Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        // ✅ FIXED: Thumbnail (shown by default or when video fails)
        <TouchableOpacity 
          style={styles.thumbnailContainer}
          onPress={handleVideoPress}
          activeOpacity={0.8}
        >
          <Image
            source={{ 
              uri: imageError 
                ? 'https://via.placeholder.com/400x225/FF6B35/ffffff?text=ProSwipe+Video' 
                : getThumbnailUrl()
            }}
            style={styles.thumbnail}
            onError={handleImageError}
            resizeMode={resizeMode}
          />
          
          {showPlayButton && (
            <View style={styles.playButtonContainer}>
              <View style={styles.playButton}>
                <Ionicons name="play" size={24} color="white" />
              </View>
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* ✅ ENHANCED: Debug indicators for development */}
      {__DEV__ && videoUrl && (
        <View style={styles.debugContainer}>
          {/* External control indicator */}
          {externalIsPlaying !== undefined && (
            <View style={[styles.debugBadge, { backgroundColor: '#17a2b8', top: 0 }]}>
              <Text style={styles.debugBadgeText}>EXT</Text>
            </View>
          )}
          
          {/* ✅ FIXED: ProSwipe S3 indicator */}
          {videoUrl.includes('proswipe-videos-prod.s3') && (
            <View style={[styles.debugBadge, { backgroundColor: '#28a745', top: externalIsPlaying !== undefined ? 25 : 0 }]}>
              <Text style={styles.debugBadgeText}>PS3</Text>
            </View>
          )}
          
          {/* CloudFront indicator */}
          {videoUrl.includes('cloudfront.net') && (
            <View style={[styles.debugBadge, { backgroundColor: '#28a745', top: externalIsPlaying !== undefined ? 25 : 0 }]}>
              <Text style={styles.debugBadgeText}>CF</Text>
            </View>
          )}
          
          {/* Generic S3 indicator */}
          {videoUrl.includes('s3.amazonaws.com') && !videoUrl.includes('proswipe-videos-prod') && (
            <View style={[styles.debugBadge, { backgroundColor: '#007AFF', top: externalIsPlaying !== undefined ? 25 : 0 }]}>
              <Text style={styles.debugBadgeText}>S3</Text>
            </View>
          )}
          
          {/* ✅ FIXED: Truncation warning for ProSwipe URLs */}
          {videoUrl.includes('proswipe-videos-prod.s3') && !videoUrl.includes('.mp4') && (
            <View style={[styles.debugBadge, { backgroundColor: '#dc3545', top: externalIsPlaying !== undefined ? 50 : 25 }]}>
              <Text style={styles.debugBadgeText}>TRUNC</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#000',
  },
  thumbnailContainer: {
    width: '100%',
    height: '100%',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  playButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 107, 53, 0.9)', // ProSwipe orange
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  // ✅ NEW: Refresh overlay styles
  refreshOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 107, 53, 0.9)', // ProSwipe orange
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 12,
  },
  refreshText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // ✅ NEW: Video ended background
  videoEndedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  // Mute button styles
  muteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  muteButtonBackground: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Debug indicators
  debugContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 5,
  },
  debugBadge: {
    position: 'absolute',
    backgroundColor: '#28a745',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  debugBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
});