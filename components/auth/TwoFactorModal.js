// src/components/auth/TwoFactorModal.js
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../config/theme';

export const TwoFactorModal = ({ visible, email, onVerify, onCancel, loading }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleCodeChange = (text) => {
    // Only allow numbers and limit to 6 digits
    const numericCode = text.replace(/[^0-9]/g, '').slice(0, 6);
    setCode(numericCode);
    setError('');
  };

  const handleVerify = () => {
    if (code.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }
    onVerify(code);
  };

  const handleCancel = () => {
    setCode('');
    setError('');
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={handleCancel}>
            <Text style={styles.modalCancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Two-Factor Authentication</Text>
          <TouchableOpacity onPress={handleVerify} disabled={loading || code.length !== 6}>
            <Text style={[
              styles.modalVerify, 
              (loading || code.length !== 6) && styles.modalVerifyDisabled
            ]}>
              {loading ? 'Verifying...' : 'Verify'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.twoFactorContent}>
            <View style={styles.twoFactorIcon}>
              <Ionicons name="shield-checkmark" size={48} color={theme.colors.primary} />
            </View>
            
            <Text style={styles.twoFactorTitle}>Enter Verification Code</Text>
            <Text style={styles.twoFactorSubtitle}>
              Please enter the 6-digit code from your authenticator app for {email}
            </Text>

            <View style={styles.codeInputContainer}>
              <TextInput
                style={styles.codeInput}
                value={code}
                onChangeText={handleCodeChange}
                placeholder="000000"
                keyboardType="numeric"
                maxLength={6}
                textAlign="center"
                fontSize={24}
                letterSpacing={8}
                autoFocus
              />
            </View>

            {error && <Text style={styles.codeError}>{error}</Text>}

            <View style={styles.twoFactorHelp}>
              <Text style={styles.helpTitle}>Need help?</Text>
              <Text style={styles.helpText}>
                • Open your authenticator app (Google Authenticator, Authy, etc.)
              </Text>
              <Text style={styles.helpText}>
                • Find the ProSwipe entry
              </Text>
              <Text style={styles.helpText}>
                • Enter the 6-digit code shown
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  modalCancel: {
    fontSize: 17,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text,
  },
  modalVerify: {
    fontSize: 17,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  modalVerifyDisabled: {
    opacity: 0.5,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  twoFactorContent: {
    paddingTop: theme.spacing.xl,
    alignItems: 'center',
  },
  twoFactorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  twoFactorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  twoFactorSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  codeInputContainer: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  codeInput: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    letterSpacing: 8,
  },
  codeError: {
    fontSize: 14,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  twoFactorHelp: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: theme.spacing.lg,
    width: '100%',
    marginTop: theme.spacing.lg,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  helpText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.xs,
  },
});