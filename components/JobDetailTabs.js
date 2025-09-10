// components/JobDetailTabs.js - Complete Job Detail Tab System
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Linking,
  FlatList,
  Modal,
  TextInput,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Video } from 'expo-av';

const { width: screenWidth } = Dimensions.get('window');

// ✅ Job Overview Tab - Complete job information
export const JobOverviewTab = ({ job, onAction }) => {
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  
  // ✅ Enhanced budget calculation with escrow
  const getBudgetInfo = () => {
    const escrow = job.escrow_payments?.[0];
    const payment = job.payments?.[0];
    
    return {
      original: {
        min: job.budget_min,
        max: job.budget_max,
        display: job.budget_min === job.budget_max 
          ? formatCurrency(job.budget_max)
          : `${formatCurrency(job.budget_min)} - ${formatCurrency(job.budget_max)}`
      },
      final: job.total_amount ? formatCurrency(job.total_amount) : null,
      escrow: escrow ? {
        amount: formatCurrency(escrow.amount_total),
        contractor: formatCurrency(escrow.amount_contractor),
        fees: formatCurrency(escrow.platform_fee + escrow.stripe_fee),
        status: escrow.status,
        releaseDate: escrow.auto_release_at
      } : null,
      payment: payment ? {
        amount: formatCurrency(payment.amount),
        status: payment.status,
        method: payment.payment_method_id,
        processed: payment.captured_at
      } : null
    };
  };

  // ✅ AI Analysis display
  const getAIAnalysis = () => {
    if (!job.ai_job_analyses || job.ai_job_analyses.length === 0) return null;
    
    const analysis = job.ai_job_analyses[0];
    return {
      confidence: Math.round(analysis.confidence_score * 100),
      complexity: analysis.complexity_level,
      jobType: analysis.job_type,
      summary: analysis.summary,
      headline: analysis.headline,
      costBreakdown: analysis.cost_breakdown,
      estimatedCost: {
        low: analysis.estimated_cost_low,
        high: analysis.estimated_cost_high,
        suggested: analysis.estimated_cost_suggested
      },
      issues: analysis.detected_issues_count,
      suggestions: analysis.suggestions_count,
      safetyFlags: analysis.safety_flags_count,
      requiresReview: analysis.requires_review,
      reviewFlags: analysis.review_flags
    };
  };

  // ✅ Location with privacy handling
  const getLocationInfo = () => {
    return {
      full: job.address,
      city: job.city,
      state: job.state,
      zip: job.zip_code,
      coordinates: job.latitude && job.longitude ? {
        lat: job.latitude,
        lng: job.longitude
      } : null
    };
  };

  const budgetInfo = getBudgetInfo();
  const aiAnalysis = getAIAnalysis();
  const locationInfo = getLocationInfo();

  const openMaps = (coordinates) => {
    const url = `maps:${coordinates.lat},${coordinates.lng}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.tabContainer} showsVerticalScrollIndicator={false}>
      {/* ✅ Video Section */}
      {job.video_url && (
        <View style={styles.card}>
          <TouchableOpacity 
            onPress={() => setVideoModalVisible(true)}
            style={styles.videoPreview}
          >
            <Image
              source={{ 
                uri: job.video_thumbnail_url || 
                     `${job.video_url}/thumbnail.jpg` 
              }}
              style={styles.videoThumbnail}
              resizeMode="cover"
            />
            <View style={styles.videoOverlay}>
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)']}
                style={styles.videoGradient}
              >
                <View style={styles.playButtonLarge}>
                  <Ionicons name="play" size={32} color="white" />
                </View>
                <Text style={styles.videoLabel}>Tap to view job video</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* ✅ Job Description */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons name="document-text-outline" size={20} color="#007AFF" />
          <Text style={styles.sectionTitle}>Job Description</Text>
        </View>
        <Text style={styles.descriptionText}>{job.description}</Text>
        
        {/* Service Category */}
        <View style={styles.categoryContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {job.service_categories?.name || job.serviceCategory?.name || 'General Service'}
            </Text>
          </View>
          {job.urgency !== 'normal' && (
            <View style={[styles.urgencyBadge, getUrgencyStyle(job.urgency)]}>
              <Ionicons name={getUrgencyIcon(job.urgency)} size={12} color="white" />
              <Text style={styles.urgencyText}>{job.urgency?.toUpperCase()}</Text>
            </View>
          )}
        </View>
      </View>

      {/* ✅ Enhanced Budget Information */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons name="cash-outline" size={20} color="#32D74B" />
          <Text style={styles.sectionTitle}>Budget & Payment</Text>
        </View>
        
        <View style={styles.budgetGrid}>
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Original Budget</Text>
            <Text style={styles.budgetValue}>{budgetInfo.original.display}</Text>
          </View>
          
          {budgetInfo.final && (
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Final Amount</Text>
              <Text style={styles.budgetValueFinal}>{budgetInfo.final}</Text>
            </View>
          )}
        </View>

        {/* Escrow Information */}
        {budgetInfo.escrow && (
          <View style={styles.escrowContainer}>
            <View style={styles.escrowHeader}>
              <Ionicons name="shield-checkmark" size={16} color="#5856D6" />
              <Text style={styles.escrowTitle}>Escrow Protection</Text>
              <View style={[styles.statusBadge, getEscrowStatusStyle(budgetInfo.escrow.status)]}>
                <Text style={styles.statusText}>{budgetInfo.escrow.status}</Text>
              </View>
            </View>
            
            <View style={styles.escrowBreakdown}>
              <View style={styles.escrowItem}>
                <Text style={styles.escrowLabel}>Contractor Payment</Text>
                <Text style={styles.escrowAmount}>{budgetInfo.escrow.contractor}</Text>
              </View>
              <View style={styles.escrowItem}>
                <Text style={styles.escrowLabel}>Platform Fees</Text>
                <Text style={styles.escrowFees}>{budgetInfo.escrow.fees}</Text>
              </View>
              <View style={styles.escrowItem}>
                <Text style={styles.escrowLabel}>Total Held</Text>
                <Text style={styles.escrowTotal}>{budgetInfo.escrow.amount}</Text>
              </View>
            </View>
            
            {budgetInfo.escrow.releaseDate && (
              <Text style={styles.escrowRelease}>
                Auto-release: {formatDate(budgetInfo.escrow.releaseDate)}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* ✅ Location Information */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons name="location-outline" size={20} color="#FF9F0A" />
          <Text style={styles.sectionTitle}>Location</Text>
        </View>
        
        <View style={styles.locationContainer}>
          <Text style={styles.locationAddress}>{locationInfo.full}</Text>
          <Text style={styles.locationCity}>
            {locationInfo.city}, {locationInfo.state} {locationInfo.zip}
          </Text>
          
          {locationInfo.coordinates && (
            <TouchableOpacity 
              style={styles.directionsButton}
              onPress={() => openMaps(locationInfo.coordinates)}
            >
              <Ionicons name="navigate" size={16} color="#007AFF" />
              <Text style={styles.directionsText}>Get Directions</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ✅ AI Analysis Section */}
      {aiAnalysis && (
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="brain" size={20} color="#5856D6" />
            <Text style={styles.sectionTitle}>AI Analysis</Text>
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>{aiAnalysis.confidence}% Confidence</Text>
            </View>
          </View>
          
          {aiAnalysis.headline && (
            <Text style={styles.aiHeadline}>{aiAnalysis.headline}</Text>
          )}
          
          <View style={styles.aiMetricsGrid}>
            <View style={styles.aiMetric}>
              <Text style={styles.aiMetricLabel}>Job Type</Text>
              <Text style={styles.aiMetricValue}>{aiAnalysis.jobType}</Text>
            </View>
            
            <View style={styles.aiMetric}>
              <Text style={styles.aiMetricLabel}>Complexity</Text>
              <Text style={styles.aiMetricValue}>
                {aiAnalysis.complexity?.charAt(0).toUpperCase() + aiAnalysis.complexity?.slice(1)}
              </Text>
            </View>
            
            {aiAnalysis.estimatedCost.suggested && (
              <View style={styles.aiMetric}>
                <Text style={styles.aiMetricLabel}>AI Cost Estimate</Text>
                <Text style={styles.aiCostValue}>
                  {formatCurrency(aiAnalysis.estimatedCost.suggested)}
                </Text>
              </View>
            )}
          </View>
          
          {aiAnalysis.summary && (
            <View style={styles.aiSummaryContainer}>
              <Text style={styles.aiSummaryTitle}>Analysis Summary</Text>
              <Text style={styles.aiSummaryText}>{aiAnalysis.summary}</Text>
            </View>
          )}
          
          {/* AI Insights */}
          <View style={styles.aiInsights}>
            {aiAnalysis.issues > 0 && (
              <View style={styles.aiInsightItem}>
                <Ionicons name="alert-circle" size={16} color="#FF453A" />
                <Text style={styles.aiInsightText}>
                  {aiAnalysis.issues} potential issues detected
                </Text>
              </View>
            )}
            
            {aiAnalysis.suggestions > 0 && (
              <View style={styles.aiInsightItem}>
                <Ionicons name="bulb" size={16} color="#FF9F0A" />
                <Text style={styles.aiInsightText}>
                  {aiAnalysis.suggestions} improvement suggestions
                </Text>
              </View>
            )}
            
            {aiAnalysis.safetyFlags > 0 && (
              <View style={styles.aiInsightItem}>
                <Ionicons name="shield-checkmark" size={16} color="#32D74B" />
                <Text style={styles.aiInsightText}>
                  {aiAnalysis.safetyFlags} safety considerations
                </Text>
              </View>
            )}
          </View>
          
          {aiAnalysis.requiresReview && (
            <View style={styles.reviewRequired}>
              <Ionicons name="eye" size={16} color="#5856D6" />
              <Text style={styles.reviewText}>
                This analysis requires manual review
              </Text>
            </View>
          )}
        </View>
      )}

      {/* ✅ Job Timeline */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons name="time-outline" size={20} color="#8E8E93" />
          <Text style={styles.sectionTitle}>Timeline</Text>
        </View>
        
        <View style={styles.timeline}>
          <TimelineItem
            icon="add-circle"
            title="Job Posted"
            date={job.created_at}
            color="#32D74B"
            completed={true}
          />
          
          {job.assigned_contractor_id && (
            <TimelineItem
              icon="person-add"
              title="Contractor Assigned"
              date={job.accepted_at || job.updated_at}
              color="#007AFF"
              completed={true}
            />
          )}
          
          {job.status === 'in_progress' && (
            <TimelineItem
              icon="build"
              title="Work in Progress"
              date={job.updated_at}
              color="#FF9F0A"
              completed={false}
              active={true}
            />
          )}
          
          {job.completed_at && (
            <TimelineItem
              icon="checkmark-done"
              title="Work Completed"
              date={job.completed_at}
              color="#32D74B"
              completed={true}
            />
          )}
          
          {job.approved_at && (
            <TimelineItem
              icon="star"
              title="Job Approved"
              date={job.approved_at}
              color="#FFD700"
              completed={true}
            />
          )}
          
          {job.preferred_date && (
            <TimelineItem
              icon="calendar"
              title="Preferred Completion"
              date={job.preferred_date}
              color="#8E8E93"
              completed={false}
              future={true}
            />
          )}
        </View>
      </View>

      {/* Video Modal */}
      <Modal
        visible={videoModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setVideoModalVisible(false)}
      >
        <View style={styles.videoModalContainer}>
          <View style={styles.videoModalHeader}>
            <Text style={styles.videoModalTitle}>Job Video</Text>
            <TouchableOpacity 
              onPress={() => setVideoModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          
          <Video
            source={{ uri: job.video_url }}
            style={styles.fullscreenVideo}
            useNativeControls
            resizeMode="contain"
            shouldPlay
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

// ✅ Job Progress Tab - Checklist and progress photos
export const JobProgressTab = ({ job, onAction }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  
  const checklist = job.job_checklist_items || [];
  const progressPhotos = job.progress_photos || [];
  const checklistPhotos = job.checklist_item_photos || [];
  
  const completedItems = checklist.filter(item => item.completed).length;
  const progressPercentage = checklist.length > 0 ? Math.round((completedItems / checklist.length) * 100) : 0;

  const renderChecklistItem = ({ item, index }) => (
    <View style={styles.checklistItem}>
      <View style={styles.checklistItemHeader}>
        <View style={[styles.checkbox, item.completed && styles.checkboxCompleted]}>
          {item.completed && <Ionicons name="checkmark" size={16} color="white" />}
        </View>
        <View style={styles.checklistItemContent}>
          <Text style={[styles.checklistTitle, item.completed && styles.checklistTitleCompleted]}>
            {item.title}
          </Text>
          {item.description && (
            <Text style={styles.checklistDescription}>{item.description}</Text>
          )}
          {item.completed_at && (
            <Text style={styles.checklistCompletedDate}>
              Completed {formatTimeAgo(item.completed_at)}
            </Text>
          )}
        </View>
      </View>
      
      {/* Photos for this checklist item */}
      {checklistPhotos.filter(photo => photo.checklist_item_id === item.id).length > 0 && (
        <View style={styles.checklistPhotos}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {checklistPhotos
              .filter(photo => photo.checklist_item_id === item.id)
              .map((photo, photoIndex) => (
                <TouchableOpacity
                  key={photoIndex}
                  onPress={() => setSelectedPhoto(photo)}
                  style={styles.checklistPhotoThumbnail}
                >
                  <Image source={{ uri: photo.url }} style={styles.photoThumbnail} />
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.tabContainer} showsVerticalScrollIndicator={false}>
      {/* Progress Overview */}
      <View style={styles.card}>
        <View style={styles.progressOverview}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Project Progress</Text>
            <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={['#32D74B', '#28CD41']}
                style={[styles.progressFill, { width: `${progressPercentage}%` }]}
              />
            </View>
          </View>
          
          <Text style={styles.progressText}>
            {completedItems} of {checklist.length} tasks completed
          </Text>
        </View>
      </View>

      {/* Checklist */}
      {checklist.length > 0 && (
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list-outline" size={20} color="#007AFF" />
            <Text style={styles.sectionTitle}>Task Checklist</Text>
          </View>
          
          <FlatList
            data={checklist}
            renderItem={renderChecklistItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.checklistSeparator} />}
          />
        </View>
      )}

      {/* Progress Photos */}
      {progressPhotos.length > 0 && (
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="camera-outline" size={20} color="#FF9F0A" />
            <Text style={styles.sectionTitle}>Progress Photos</Text>
          </View>
          
          <View style={styles.photoGrid}>
            {progressPhotos.map((photo, index) => (
              <TouchableOpacity
                key={index}
                style={styles.photoGridItem}
                onPress={() => setSelectedPhoto(photo)}
              >
                <Image source={{ uri: photo.url }} style={styles.gridPhoto} />
                {photo.description && (
                  <View style={styles.photoCaption}>
                    <Text style={styles.photoCaptionText} numberOfLines={2}>
                      {photo.description}
                    </Text>
                  </View>
                )}
                <Text style={styles.photoDate}>
                  {formatTimeAgo(photo.uploaded_at)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* No Progress Yet */}
      {checklist.length === 0 && progressPhotos.length === 0 && (
        <View style={styles.card}>
          <View style={styles.emptyProgress}>
            <Ionicons name="build-outline" size={48} color="#8E8E93" />
            <Text style={styles.emptyProgressTitle}>No Progress Yet</Text>
            <Text style={styles.emptyProgressText}>
              Progress updates will appear here once work begins.
            </Text>
          </View>
        </View>
      )}

      {/* Photo Modal */}
      <Modal
        visible={!!selectedPhoto}
        animationType="fade"
        presentationStyle="overFullScreen"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={styles.photoModalContainer}>
          <TouchableOpacity 
            style={styles.photoModalClose}
            onPress={() => setSelectedPhoto(null)}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          
          {selectedPhoto && (
            <>
              <Image 
                source={{ uri: selectedPhoto.url }} 
                style={styles.fullscreenPhoto}
                resizeMode="contain"
              />
              
              {selectedPhoto.description && (
                <View style={styles.photoModalCaption}>
                  <Text style={styles.photoModalCaptionText}>
                    {selectedPhoto.description}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

// ✅ Job Messages Tab - Communication hub
export const JobMessagesTab = ({ job, onAction }) => {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState(job.messages || []);

  const sendMessage = () => {
    if (messageText.trim()) {
      onAction?.('sendMessage', { message: messageText.trim() });
      setMessageText('');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageItem,
      item.is_from_homeowner ? styles.messageFromHomeowner : styles.messageFromContractor
    ]}>
      <View style={styles.messageHeader}>
        <Text style={styles.messageSender}>
          {item.is_from_homeowner ? 'Homeowner' : 'Contractor'}
        </Text>
        <Text style={styles.messageTime}>
          {formatDateTime(item.created_at)}
        </Text>
      </View>
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.tabContainer}>
      {/* Messages List */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyMessages}>
            <Ionicons name="chatbubbles-outline" size={48} color="#8E8E93" />
            <Text style={styles.emptyMessagesTitle}>No Messages Yet</Text>
            <Text style={styles.emptyMessagesText}>
              Start a conversation about this job.
            </Text>
          </View>
        )}
      />

      {/* Message Input */}
      <View style={styles.messageInputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, messageText.trim() && styles.sendButtonActive]}
          onPress={sendMessage}
          disabled={!messageText.trim()}
        >
          <Ionicons name="send" size={20} color={messageText.trim() ? 'white' : '#8E8E93'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ✅ Job Payments Tab - Payment information and actions
export const JobPaymentsTab = ({ job, onAction }) => {
  const payments = job.payments || [];
  const escrow = job.escrow_payments?.[0];

  const renderPayment = ({ item }) => (
    <View style={styles.paymentItem}>
      <View style={styles.paymentHeader}>
        <View style={styles.paymentAmount}>
          <Text style={styles.paymentAmountText}>{formatCurrency(item.amount)}</Text>
          <View style={[styles.paymentStatusBadge, getPaymentStatusStyle(item.status)]}>
            <Text style={styles.paymentStatusText}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.paymentDate}>{formatDateTime(item.created_at)}</Text>
      </View>
      
      {item.description && (
        <Text style={styles.paymentDescription}>{item.description}</Text>
      )}
      
      <View style={styles.paymentDetails}>
        <Text style={styles.paymentDetailText}>
          Method: {item.payment_method_id || 'Card ending in ****'}
        </Text>
        {item.captured_at && (
          <Text style={styles.paymentDetailText}>
            Processed: {formatDateTime(item.captured_at)}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.tabContainer} showsVerticalScrollIndicator={false}>
      {/* Escrow Information */}
      {escrow && (
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark" size={20} color="#5856D6" />
            <Text style={styles.sectionTitle}>Escrow Protection</Text>
          </View>
          
          <View style={styles.escrowSummary}>
            <Text style={styles.escrowAmount}>{formatCurrency(escrow.amount_total)}</Text>
            <View style={[styles.escrowStatusBadge, getEscrowStatusStyle(escrow.status)]}>
              <Text style={styles.escrowStatusText}>{escrow.status}</Text>
            </View>
          </View>
          
          <View style={styles.escrowBreakdown}>
            <View style={styles.escrowBreakdownItem}>
              <Text style={styles.escrowLabel}>Contractor Payment</Text>
              <Text style={styles.escrowValue}>{formatCurrency(escrow.amount_contractor)}</Text>
            </View>
            <View style={styles.escrowBreakdownItem}>
              <Text style={styles.escrowLabel}>Platform Fee</Text>
              <Text style={styles.escrowValue}>{formatCurrency(escrow.platform_fee)}</Text>
            </View>
            <View style={styles.escrowBreakdownItem}>
              <Text style={styles.escrowLabel}>Processing Fee</Text>
              <Text style={styles.escrowValue}>{formatCurrency(escrow.stripe_fee)}</Text>
            </View>
          </View>
          
          {escrow.auto_release_at && (
            <Text style={styles.escrowAutoRelease}>
              Auto-release: {formatDate(escrow.auto_release_at)}
            </Text>
          )}
          
          {job.status === 'completed' && escrow.status === 'held' && (
            <TouchableOpacity 
              style={styles.releaseButton}
              onPress={() => onAction?.('releasePayment')}
            >
              <Text style={styles.releaseButtonText}>Release Payment</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Payment History */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons name="card-outline" size={20} color="#32D74B" />
          <Text style={styles.sectionTitle}>Payment History</Text>
        </View>
        
        {payments.length > 0 ? (
          <FlatList
            data={payments}
            renderItem={renderPayment}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.paymentSeparator} />}
          />
        ) : (
          <View style={styles.emptyPayments}>
            <Ionicons name="card-outline" size={48} color="#8E8E93" />
            <Text style={styles.emptyPaymentsTitle}>No Payments Yet</Text>
            <Text style={styles.emptyPaymentsText}>
              Payment information will appear here once transactions are made.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// ✅ Job Files Tab - Documents and attachments
export const JobFilesTab = ({ job, onAction }) => {
  const files = job.attachments || [];
  const photos = job.photos || [];
  const documents = files.filter(file => !file.url.match(/\.(jpg|jpeg|png|gif)$/i));

  const openFile = (file) => {
    Linking.openURL(file.url);
  };

  const renderFile = ({ item }) => (
    <TouchableOpacity style={styles.fileItem} onPress={() => openFile(item)}>
      <View style={styles.fileIcon}>
        <Ionicons name={getFileIcon(item.filename)} size={24} color="#007AFF" />
      </View>
      <View style={styles.fileDetails}>
        <Text style={styles.fileName} numberOfLines={1}>{item.filename}</Text>
        <Text style={styles.fileSize}>
          {formatFileSize(item.size)} • {formatTimeAgo(item.uploaded_at)}
        </Text>
      </View>
      <Ionicons name="download-outline" size={20} color="#8E8E93" />
    </TouchableOpacity>
  );

  const renderPhoto = ({ item }) => (
    <TouchableOpacity style={styles.photoItem} onPress={() => openFile(item)}>
      <Image source={{ uri: item.url }} style={styles.photoThumbnailSmall} />
      <Text style={styles.photoFileName} numberOfLines={1}>{item.filename}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.tabContainer} showsVerticalScrollIndicator={false}>
      {/* Photos */}
      {photos.length > 0 && (
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="images-outline" size={20} color="#FF9F0A" />
            <Text style={styles.sectionTitle}>Photos ({photos.length})</Text>
          </View>
          
          <FlatList
            data={photos}
            renderItem={renderPhoto}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            scrollEnabled={false}
            columnWrapperStyle={styles.photoRow}
          />
        </View>
      )}

      {/* Documents */}
      {documents.length > 0 && (
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-outline" size={20} color="#5856D6" />
            <Text style={styles.sectionTitle}>Documents ({documents.length})</Text>
          </View>
          
          <FlatList
            data={documents}
            renderItem={renderFile}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.fileSeparator} />}
          />
        </View>
      )}

      {/* No Files */}
      {files.length === 0 && (
        <View style={styles.card}>
          <View style={styles.emptyFiles}>
            <Ionicons name="folder-outline" size={48} color="#8E8E93" />
            <Text style={styles.emptyFilesTitle}>No Files Attached</Text>
            <Text style={styles.emptyFilesText}>
              Files and documents will appear here when shared.
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

// ✅ Timeline Item Component
const TimelineItem = ({ icon, title, date, color, completed, active, future }) => (
  <View style={styles.timelineItem}>
    <View style={[
      styles.timelineIcon, 
      { backgroundColor: completed ? color : '#F0F0F0' },
      active && styles.timelineIconActive
    ]}>
      <Ionicons 
        name={icon} 
        size={16} 
        color={completed ? 'white' : '#8E8E93'} 
      />
    </View>
    
    <View style={styles.timelineContent}>
      <Text style={[
        styles.timelineTitle,
        completed && styles.timelineTitleCompleted,
        future && styles.timelineTitleFuture
      ]}>
        {title}
      </Text>
      <Text style={styles.timelineDate}>
        {future ? `Target: ${formatDate(date)}` : formatDateTime(date)}
      </Text>
    </View>
  </View>
);

// ✅ Utility Functions
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

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(dateString));
};

const formatDateTime = (dateString) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(dateString));
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getUrgencyStyle = (urgency) => {
  switch (urgency) {
    case 'urgent': return { backgroundColor: '#FF453A' };
    case 'high': return { backgroundColor: '#FF9F0A' };
    case 'low': return { backgroundColor: '#32D74B' };
    default: return { backgroundColor: '#8E8E93' };
  }
};

const getUrgencyIcon = (urgency) => {
  switch (urgency) {
    case 'urgent': return 'flash';
    case 'high': return 'arrow-up';
    case 'low': return 'time';
    default: return 'remove';
  }
};

const getEscrowStatusStyle = (status) => {
  switch (status) {
    case 'held': return { backgroundColor: '#5856D6' };
    case 'released': return { backgroundColor: '#32D74B' };
    case 'disputed': return { backgroundColor: '#FF453A' };
    default: return { backgroundColor: '#8E8E93' };
  }
};

const getPaymentStatusStyle = (status) => {
  switch (status) {
    case 'completed': return { backgroundColor: '#32D74B' };
    case 'pending': return { backgroundColor: '#FF9F0A' };
    case 'failed': return { backgroundColor: '#FF453A' };
    default: return { backgroundColor: '#8E8E93' };
  }
};

const getFileIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'pdf': return 'document-text';
    case 'doc':
    case 'docx': return 'document';
    case 'xls':
    case 'xlsx': return 'grid';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif': return 'image';
    case 'zip':
    case 'rar': return 'archive';
    default: return 'document-outline';
  }
};

// ✅ Styles
const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    flex: 1,
  },
  
  // Video Section
  videoPreview: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  videoGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  videoLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Description Section
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1C1C1E',
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
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
    color: 'white',
  },
  
  // Budget Section
  budgetGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  budgetItem: {
    flex: 1,
  },
  budgetLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  budgetValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#32D74B',
  },
  budgetValueFinal: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
  },
  
  // Escrow Section
  escrowContainer: {
    backgroundColor: '#F4F3FF',
    padding: 16,
    borderRadius: 12,
  },
  escrowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  escrowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  escrowBreakdown: {
    gap: 8,
  },
  escrowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  escrowLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  escrowAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  escrowFees: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9F0A',
  },
  escrowTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5856D6',
  },
  escrowRelease: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'center',
  },
  
  // Location Section
  locationContainer: {
    gap: 8,
  },
  locationAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  locationCity: {
    fontSize: 14,
    color: '#8E8E93',
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
    gap: 6,
  },
  directionsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  
  // AI Analysis Section
  confidenceBadge: {
    backgroundColor: '#5856D6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  aiHeadline: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  aiMetricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
  },
  aiMetric: {
    flex: 1,
  },
  aiMetricLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  aiMetricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  aiCostValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5856D6',
  },
  aiSummaryContainer: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  aiSummaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  aiSummaryText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1C1C1E',
  },
  aiInsights: {
    gap: 8,
  },
  aiInsightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiInsightText: {
    fontSize: 14,
    color: '#1C1C1E',
  },
  reviewRequired: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  reviewText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5856D6',
  },
  
  // Timeline Section
  timeline: {
    gap: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIconActive: {
    shadowColor: '#FF9F0A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 4,
  },
  timelineTitleCompleted: {
    color: '#1C1C1E',
  },
  timelineTitleFuture: {
    fontStyle: 'italic',
  },
  timelineDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  
  // Progress Tab
  progressOverview: {
    alignItems: 'center',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: '800',
    color: '#32D74B',
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: 12,
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
  progressText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  
  // Checklist
  checklistItem: {
    paddingVertical: 12,
  },
  checklistItemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxCompleted: {
    backgroundColor: '#32D74B',
    borderColor: '#32D74B',
  },
  checklistItemContent: {
    flex: 1,
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  checklistTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  checklistDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 4,
  },
  checklistCompletedDate: {
    fontSize: 12,
    color: '#32D74B',
    fontWeight: '500',
  },
  checklistSeparator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
  },
  checklistPhotos: {
    marginTop: 12,
    marginLeft: 36,
  },
  checklistPhotoThumbnail: {
    marginRight: 8,
  },
  photoThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  
  // Photo Grid
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoGridItem: {
    width: (screenWidth - 80) / 3,
    marginBottom: 8,
  },
  gridPhoto: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 4,
  },
  photoCaption: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    padding: 4,
  },
  photoCaptionText: {
    color: 'white',
    fontSize: 10,
  },
  photoDate: {
    fontSize: 10,
    color: '#8E8E93',
    textAlign: 'center',
  },
  
  // Empty States
  emptyProgress: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyProgressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyProgressText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  
  // Messages Tab
  messagesList: {
    flex: 1,
    padding: 20,
  },
  messagesContent: {
    paddingBottom: 20,
  },
  messageItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    maxWidth: '80%',
  },
  messageFromHomeowner: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  messageFromContractor: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  messageTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#1C1C1E',
  },
  messageInputContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'flex-end',
    gap: 12,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#007AFF',
  },
  emptyMessages: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyMessagesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessagesText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  
  // Payments Tab
  escrowSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  escrowAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#5856D6',
  },
  escrowStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  escrowStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  escrowBreakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  escrowValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  escrowAutoRelease: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 12,
  },
  releaseButton: {
    backgroundColor: '#32D74B',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  releaseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  paymentItem: {
    paddingVertical: 16,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentAmountText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#32D74B',
  },
  paymentStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paymentStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  paymentDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  paymentDescription: {
    fontSize: 14,
    color: '#1C1C1E',
    marginBottom: 8,
  },
  paymentDetails: {
    gap: 4,
  },
  paymentDetailText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  paymentSeparator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
  },
  emptyPayments: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyPaymentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyPaymentsText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  
  // Files Tab
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
    color: '#8E8E93',
  },
  photoItem: {
    width: (screenWidth - 80) / 3,
    alignItems: 'center',
  },
  photoThumbnailSmall: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 4,
  },
  photoFileName: {
    fontSize: 10,
    color: '#8E8E93',
    textAlign: 'center',
  },
  photoRow: {
    justifyContent: 'space-between',
  },
  fileSeparator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
  },
  emptyFiles: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyFilesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyFilesText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  
  // Modals
  videoModalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  videoModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenVideo: {
    flex: 1,
  },
  photoModalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoModalClose: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  fullscreenPhoto: {
    width: '100%',
    height: '100%',
  },
  photoModalCaption: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 16,
    borderRadius: 12,
  },
  photoModalCaptionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default {
  JobOverviewTab,
  JobProgressTab,
  JobMessagesTab,
  JobPaymentsTab,
  JobFilesTab
};