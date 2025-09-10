// components/PaywallModal.js - Modal for AI feature payments
import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../services/ApiService';

const PaywallModal = ({ visible, onClose, onPaymentSuccess, featureType }) => {
  const [loading, setLoading] = useState(false);

  const featureDetails = {
    budget: {
      title: 'AI Budget Estimation',
      description: 'Get intelligent cost estimates powered by AI analysis',
      price: '$2.99',
      icon: '💰'
    },
    checklist: {
      title: 'AI Smart Checklist',
      description: 'Generate personalized task checklists with AI recommendations',
      price: '$1.99',
      icon: '✅'
    }
  };

  const feature = featureDetails[featureType] || featureDetails.budget;

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Call your payment API
      const response = await apiClient.purchaseAIFeature(
        featureType,
        feature.price.replace('$', '')
      );

      if (response.success) {
        Alert.alert(
          'Payment Successful!',
          `You now have access to ${feature.title}`,
          [
            {
              text: 'Continue',
              onPress: () => {
                onPaymentSuccess();
                onClose();
              }
            }
          ]
        );
      } else {
        throw new Error(response.message || 'Payment failed');
      }
    } catch (error) {
      Alert.alert(
        'Payment Failed',
        error.message || 'Unable to process payment. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.icon}>{feature.icon}</Text>
            <Text style={styles.title}>Unlock {feature.title}</Text>
            <Text style={styles.description}>{feature.description}</Text>
            
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{feature.price}</Text>
              <Text style={styles.priceLabel}>one-time purchase</Text>
            </View>

            <View style={styles.features}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>Instant AI analysis</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>Accurate cost estimates</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>Unlimited usage</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.payButton, loading && styles.payButtonDisabled]}
              onPress={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.payButtonText}>Purchase Now</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              Secure payment • Cancel anytime • No subscription
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: 0,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    padding: 24,
    paddingTop: 8,
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  features: {
    width: '100%',
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  payButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default PaywallModal;