// components/auth/loginStyles.js - Modern Dynamic Styles
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Modern dynamic theme
const theme = {
  colors: {
    primary: '#FF6B35',
    primaryLight: '#FF8A65',
    primaryDark: '#E64A19',
    secondary: '#4ECDC4',
    accent: '#FFD54F',
    background: '#0F172A', // Dark modern background
    surface: '#1E293B',
    surfaceLight: '#334155',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    error: '#EF4444',
    success: '#10B981',
    border: '#374151',
    overlay: 'rgba(0, 0, 0, 0.4)',
    glass: 'rgba(255, 255, 255, 0.1)',
    glassBorder: 'rgba(255, 255, 255, 0.2)',
  },
  gradients: {
    primary: ['#FF6B35', '#FF8A65', '#FFAB91'],
    secondary: ['#4ECDC4', '#26A69A', '#00796B'],
    background: ['#0F172A', '#1E293B', '#334155'],
    card: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
    button: ['#FF6B35', '#FF8A65'],
    accent: ['#FFD54F', '#FFC107'],
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 12,
    },
    glow: {
      shadowColor: '#FF6B35',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 15,
    },
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
    },
    small: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
    },
  },
};

export const loginStyles = StyleSheet.create({
  // Base Container Styles
  container: {
    flex: 1,
  },
  safeContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: height,
  },

  // Modern Background & Layout
  backgroundGradient: {
    flex: 1,
    background: `linear-gradient(135deg, ${theme.gradients.background.join(', ')})`,
  },
  
  // Enhanced Logo Styles
  logoSection: {
    alignItems: 'center',
    paddingTop: theme.spacing.xxxl,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: theme.colors.primary,
    opacity: 0.3,
    ...theme.shadows.glow,
  },
  logoMain: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.primary,
    ...theme.shadows.lg,
  },
  logoImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  logoFallback: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Welcome Section
  welcomeSection: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  welcomeTitle: {
    ...theme.typography.h1,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: theme.spacing.md,
  },

  // Form Section
  formSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  
  // Modern Input Styles
  inputContainer: {
    marginBottom: theme.spacing.lg,
    position: 'relative',
  },
  inputWrapper: {
    height: 56,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.glass,
    overflow: 'hidden',
    position: 'relative',
  },
  inputWrapperFocused: {
    borderColor: theme.colors.primary,
    ...theme.shadows.glow,
  },
  inputBlur: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 8,
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  inputLabel: {
    position: 'absolute',
    left: 48,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  inputLabelFocused: {
    color: theme.colors.primary,
  },
  inputError: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.md,
    fontWeight: '500',
  },

  // User Type Selection
  userTypeSection: {
    marginBottom: theme.spacing.lg,
  },
  userTypeLabel: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  userTypeContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  userTypeOption: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  userTypeOptionActive: {
    borderColor: theme.colors.primary,
    ...theme.shadows.glow,
  },
  userTypeContent: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  userTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  userTypeIconActive: {
    backgroundColor: theme.colors.primary,
  },
  userTypeText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  userTypeTextActive: {
    color: theme.colors.primary,
  },

  // Modern Button Styles
  buttonContainer: {
    marginVertical: theme.spacing.sm,
  },
  buttonWrapper: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  buttonGradient: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: theme.spacing.sm,
  },
  buttonText: {
    ...theme.typography.body,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonSecondary: {
    ...theme.shadows.md,
  },

  // Switch Mode Section
  switchModeContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  switchModeText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  switchModeLink: {
    color: theme.colors.primary,
    fontWeight: '600',
  },

  // 2FA Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  modalHeader: {
    alignItems: 'center',
    marginTop: theme.spacing.xxxl,
    marginBottom: theme.spacing.xl,
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  modalTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  modalSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  modalCodeInput: {
    backgroundColor: theme.colors.glass,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    letterSpacing: 8,
    width: '100%',
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  modalError: {
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    width: '100%',
  },

  // Biometric Section
  biometricContainer: {
    marginBottom: theme.spacing.md,
  },
  biometricButton: {
    ...theme.shadows.md,
  },

  // Animation & Effects
  fadeContainer: {
    opacity: 0, // Will be animated
  },
  slideContainer: {
    transform: [{ translateY: 50 }], // Will be animated
  },

  // Glass Effects
  glassCard: {
    backgroundColor: theme.colors.glass,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  blurBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
  },

  // Responsive Design
  smallScreen: {
    paddingHorizontal: theme.spacing.md,
  },
  largeScreen: {
    paddingHorizontal: theme.spacing.xl,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },

  // States
  loading: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
  error: {
    borderColor: theme.colors.error,
  },
  success: {
    borderColor: theme.colors.success,
  },

  // Accessibility
  accessibilityLabel: {
    position: 'absolute',
    left: -9999,
    top: -9999,
  },

  // Platform-specific
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  android: {
    elevation: 4,
  },

  // Debug styles (remove in production)
  debug: {
    borderWidth: 1,
    borderColor: 'red',
  },
  debugText: {
    color: 'red',
    fontSize: 10,
  },
});