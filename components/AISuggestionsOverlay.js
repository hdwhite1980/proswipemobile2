// components/AISuggestionsOverlay.js - Enhanced suggestions for your categories
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AISuggestionsOverlay = ({ 
  category, 
  suggestions, 
  visible, 
  animValue 
}) => {
  // Get category-specific tips
  const getCategoryTips = () => {
    const categoryKey = category?.toLowerCase()
      .replace(/[&\/]/g, '_')
      .replace(/\s+/g, '_')
      .replace(/-+/g, '_');
    
    const tips = {
      home_repair_handyman_services: {
        icon: '🔧',
        mainTip: 'Show the damage clearly from multiple angles',
        subTips: [
          'Include size reference (coin, hand, ruler)',
          'Record any water stains or electrical issues',
          'Show the area around the problem'
        ]
      },
      lawn_landscaping_services: {
        icon: '🌿',
        mainTip: 'Pan slowly across your entire yard',
        subTips: [
          'Focus on problem areas (weeds, bare spots)',
          'Show property edges and access points',
          'Include close-ups of grass/plant condition'
        ]
      },
      trash_junk_removal: {
        icon: '🗑️',
        mainTip: 'Show all items in one wide shot first',
        subTips: [
          'Walk the path to street/truck access',
          'Point out heavy or hazardous items',
          'Estimate pile size with reference'
        ]
      },
      moving_help_labor_only_movers: {
        icon: '📦',
        mainTip: 'Walk through each room systematically',
        subTips: [
          'Show all stairs and narrow passages',
          'Focus on large furniture and appliances',
          'Point out fragile or valuable items'
        ]
      }
    };
    
    return tips[categoryKey] || {
      icon: '📹',
      mainTip: 'Record the area that needs work',
      subTips: ['Good lighting is important', 'Show the problem clearly', 'Include relevant details']
    };
  };

  const categoryTips = getCategoryTips();

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: animValue,
          transform: [{
            translateY: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0]
            })
          }]
        }
      ]}
    >
      {/* Main Category Tip */}
      <View style={styles.mainTipCard}>
        <Text style={styles.categoryIcon}>{categoryTips.icon}</Text>
        <View style={styles.mainTipContent}>
          <Text style={styles.categoryName}>{category}</Text>
          <Text style={styles.mainTipText}>{categoryTips.mainTip}</Text>
        </View>
      </View>

      {/* Quick Tips List */}
      <View style={styles.tipsContainer}>
        {categoryTips.subTips.map((tip, index) => (
          <View key={index} style={styles.tipRow}>
            <View style={styles.tipBullet}>
              <Text style={styles.tipNumber}>{index + 1}</Text>
            </View>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>

      {/* Live Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <View style={styles.liveSuggestionsContainer}>
          {suggestions.map((suggestion) => (
            <Animated.View 
              key={suggestion.id}
              style={[
                styles.suggestionBubble,
                {
                  backgroundColor: getSuggestionColor(suggestion.priority),
                  opacity: animValue
                }
              ]}
            >
              <Ionicons 
                name={getIconName(suggestion.icon)} 
                size={14} 
                color="white" 
              />
              <Text style={styles.suggestionText}>{suggestion.text}</Text>
            </Animated.View>
          ))}
        </View>
      )}

      {/* Recording Quality Indicator */}
      <View style={styles.qualityIndicator}>
        <View style={styles.qualityDot} />
        <Text style={styles.qualityText}>AI Assistant Active</Text>
      </View>
    </Animated.View>
  );
};

// Helper functions
const getSuggestionColor = (priority) => {
  switch (priority) {
    case 'high': return 'rgba(255, 59, 48, 0.9)';
    case 'medium': return 'rgba(255, 149, 0, 0.9)';
    case 'low': return 'rgba(52, 199, 89, 0.9)';
    default: return 'rgba(0, 122, 255, 0.9)';
  }
};

const getIconName = (iconEmoji) => {
  const iconMap = {
    '🔧': 'construct',
    '📐': 'resize',
    '📏': 'analytics',
    '🚪': 'enter',
    '⚡': 'flash',
    '🌿': 'leaf',
    '🌱': 'flower',
    '🔍': 'search',
    '🚚': 'car',
    '🗑️': 'trash',
    '🚶': 'walk',
    '☢️': 'warning',
    '📦': 'cube',
    '🏠': 'home',
    '🛋️': 'bed',
    '💎': 'diamond',
    '💡': 'bulb',
    '🎤': 'mic'
  };
  
  return iconMap[iconEmoji] || 'information-circle';
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    zIndex: 100,
  },
  mainTipCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  mainTipContent: {
    flex: 1,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mainTipText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    lineHeight: 20,
  },
  tipsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 1,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  tipNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFD700',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
  liveSuggestionsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  suggestionBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'white',
    flex: 1,
  },
  qualityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  qualityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#32D74B',
    marginRight: 6,
  },
  qualityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#32D74B',
  },
});

export default AISuggestionsOverlay;