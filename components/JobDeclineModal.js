// components/JobDeclineModal.js - Modal for declining assigned jobs
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const JobDeclineModal = ({ 
  visible, 
  onClose, 
  onDecline, 
  job, 
  loading = false 
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customDetails, setCustomDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Decline reason options matching your backend
  const declineReasons = [
    {
      value: 'schedule_conflict',
      label: 'Schedule Conflict',
      icon: 'calendar-outline',
      description: 'I\'m too busy with other projects right now',
      color: '#FF9500'
    },
    {
      value: 'outside_expertise',
      label: 'Outside My Expertise',
      icon: 'school-outline',
      description: 'This job requires skills I don\'t specialize in',
      color: '#007AFF'
    },
    {
      value: 'budget_too_low',
      label: 'Budget Too Low',
      icon: 'cash-outline',
      description: 'The budget doesn\'t meet my rates',
      color: '#FF3B30'
    },
    {
      value: 'location_too_far',
      label: 'Location Too Far',
      icon: 'location-outline',
      description: 'This location is outside my service area',
      color: '#8E8E93'
    },
    {
      value: 'insufficient_details',
      label: 'Need More Information',
      icon: 'help-circle-outline',
      description: 'I need more details before I can proceed',
      color: '#32D74B'
    },
    {
      value: 'personal_reasons',
      label: 'Personal Reasons',
      icon: 'person-outline',
      description: 'Personal circumstances prevent me from taking this job',
      color: '#FF6B35'
    },
    {
      value: 'other',
      label: 'Other Reason',
      icon: 'ellipsis-horizontal-outline',
      description: 'I\'ll explain in the details below',
      color: '#666666'
    }
  ];

  const handleSubmit = async () => {
    if (!selectedReason) {
      Alert.alert('Please Select a Reason', 'You must select a reason for declining this job.');
      return;
    }

    // Validate custom details for "other" reason
    if (selectedReason === 'other' && !customDetails.trim()) {
      Alert.alert('Details Required', 'Please provide details for declining this job.');
      return;
    }

    setSubmitting(true);

    try {
      const result = await onDecline({
        jobId: job.id,
        reason: selectedReason,
        details: customDetails.trim(),
        jobTitle: job.title
      });

      // Reset form
      setSelectedReason('');
      setCustomDetails('');
      
      // Show success message
      Alert.alert(
        'Job Declined',
        `You have successfully declined "${job.title}". The homeowner has been notified and the job will be returned to the public feed.`,
        [{ text: 'OK', onPress: onClose }]
      );

    } catch (error) {
      console.error('❌ Failed to decline job:', error);
      Alert.alert(
        'Decline Failed', 
        error.message || 'Failed to decline job. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedReasonData = declineReasons.find(r => r.value === selectedReason);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Decline Job</Text>
          <TouchableOpacity 
            onPress={handleSubmit}
            disabled={!selectedReason || submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FF3B30" />
            ) : (
              <Text style={[
                styles.submitButton,
                (!selectedReason || submitting) && styles.submitButtonDisabled
              ]}>
                Decline
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Job Info */}
          <View style={styles.jobInfoSection}>
            <Text style={styles.sectionTitle}>Job Details</Text>
            <View style={styles.jobInfoCard}>
              <Text style={styles.jobTitle} numberOfLines={2}>
                {job?.title || 'Job Title'}
              </Text>
              <Text style={styles.jobBudget}>
                ${job?.budget_min} - ${job?.budget_max}
              </Text>
              <View style={styles.jobMeta}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text style={styles.jobLocation}>
                  {job?.city}, {job?.state}
                </Text>
              </View>
            </View>
          </View>

          {/* Decline Reasons */}
          <View style={styles.reasonsSection}>
            <Text style={styles.sectionTitle}>Why are you declining this job?</Text>
            <Text style={styles.sectionSubtitle}>
              Select the main reason so we can improve job matching
            </Text>

            {declineReasons.map((reason) => (
              <TouchableOpacity
                key={reason.value}
                style={[
                  styles.reasonOption,
                  selectedReason === reason.value && styles.reasonOptionSelected
                ]}
                onPress={() => setSelectedReason(reason.value)}
              >
                <View style={styles.reasonContent}>
                  <View style={[styles.reasonIcon, { backgroundColor: reason.color + '20' }]}>
                    <Ionicons 
                      name={reason.icon} 
                      size={20} 
                      color={selectedReason === reason.value ? 'white' : reason.color} 
                    />
                  </View>
                  <View style={styles.reasonText}>
                    <Text style={[
                      styles.reasonLabel,
                      selectedReason === reason.value && styles.reasonLabelSelected
                    ]}>
                      {reason.label}
                    </Text>
                    <Text style={[
                      styles.reasonDescription,
                      selectedReason === reason.value && styles.reasonDescriptionSelected
                    ]}>
                      {reason.description}
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.radioButton,
                  selectedReason === reason.value && styles.radioButtonSelected
                ]}>
                  {selectedReason === reason.value && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Additional Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>
              Additional Details 
              {selectedReason === 'other' && <Text style={styles.required}> *</Text>}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {selectedReason === 'other' 
                ? 'Please explain your reason for declining'
                : 'Optional: Provide more context or suggestions (recommended)'
              }
            </Text>

            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                value={customDetails}
                onChangeText={setCustomDetails}
                placeholder={
                  selectedReason === 'insufficient_details' 
                    ? "What additional information do you need?" 
                    : selectedReason === 'budget_too_low'
                    ? "What would be a fair budget for this work?"
                    : selectedReason === 'other'
                    ? "Please explain your reason..."
                    : "Any additional context or suggestions..."
                }
                multiline
                numberOfLines={4}
                maxLength={500}
                textAlignVertical="top"
              />
              <Text style={styles.characterCount}>
                {customDetails.length}/500 characters
              </Text>
            </View>
          </View>

          {/* Professional Note */}
          <View style={styles.noteSection}>
            <View style={styles.noteHeader}>
              <Ionicons name="information-circle" size={20} color="#007AFF" />
              <Text style={styles.noteTitle}>Professional Courtesy</Text>
            </View>
            <Text style={styles.noteText}>
              Declining professionally helps maintain good relationships. The homeowner will be 
              notified with your reason, and the job will be returned to the public feed for 
              other contractors.
            </Text>
          </View>

          {/* Impact Preview */}
          {selectedReasonData && (
            <View style={styles.impactSection}>
              <Text style={styles.impactTitle}>What happens next:</Text>
              <View style={styles.impactList}>
                <View style={styles.impactItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#32D74B" />
                  <Text style={styles.impactText}>
                    Homeowner receives your decline reason
                  </Text>
                </View>
                <View style={styles.impactItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#32D74B" />
                  <Text style={styles.impactText}>
                    Job returns to public feed immediately
                  </Text>
                </View>
                <View style={styles.impactItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#32D74B" />
                  <Text style={styles.impactText}>
                    No negative impact on your profile
                  </Text>
                </View>
                {customDetails.trim() && (
                  <View style={styles.impactItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#007AFF" />
                    <Text style={styles.impactText}>
                      Your helpful feedback will be included
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Action */}
        <View style={styles.bottomSection}>
          <TouchableOpacity 
            style={[
              styles.declineButton,
              (!selectedReason || submitting) && styles.declineButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!selectedReason || submitting}
          >
            <LinearGradient
              colors={
                !selectedReason || submitting
                  ? ['#CCC', '#999']
                  : ['#FF3B30', '#D70015']
              }
              style={styles.declineButtonGradient}
            >
              {submitting ? (
                <>
                  <ActivityIndicator size="small" color="white" />
                  <Text style={styles.declineButtonText}>Declining...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="close-circle" size={20} color="white" />
                  <Text style={styles.declineButtonText}>
                    Decline "{job?.title?.substring(0, 20) || 'Job'}"
                    {job?.title?.length > 20 ? '...' : ''}
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  cancelButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  submitButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  submitButtonDisabled: {
    color: '#8E8E93',
  },
  content: {
    flex: 1,
    padding: 20,
  },

  // Job Info Section
  jobInfoSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
    lineHeight: 20,
  },
  jobInfoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  jobBudget: {
    fontSize: 18,
    fontWeight: '700',
    color: '#32D74B',
    marginBottom: 8,
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobLocation: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },

  // Reasons Section
  reasonsSection: {
    marginBottom: 32,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  reasonOptionSelected: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  reasonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reasonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reasonText: {
    flex: 1,
  },
  reasonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  reasonLabelSelected: {
    color: '#FF3B30',
  },
  reasonDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  reasonDescriptionSelected: {
    color: '#666',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#FF3B30',
    backgroundColor: '#FF3B30',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },

  // Details Section
  detailsSection: {
    marginBottom: 32,
  },
  required: {
    color: '#FF3B30',
  },
  textInputContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  textInput: {
    padding: 16,
    fontSize: 16,
    color: '#1C1C1E',
    minHeight: 100,
  },
  characterCount: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  // Note Section
  noteSection: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#B3D9FF',
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#005BB5',
    lineHeight: 20,
  },

  // Impact Section
  impactSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  impactList: {
    gap: 8,
  },
  impactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },

  // Bottom Section
  bottomSection: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  declineButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  declineButtonDisabled: {
    opacity: 0.6,
  },
  declineButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default JobDeclineModal;