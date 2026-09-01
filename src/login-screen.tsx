import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { LoginScreenProps, LoginText, LoginTheme } from './types';

const DEFAULT_TEXT: Required<LoginText> = {
  subtitle: 'Panel de negocio / super-admin',
  identifierPlaceholder: 'Correo o teléfono',
  passwordPlaceholder: '••••••••',
  submit: 'Entrar',
  forgotPassword: '¿Olvidaste tu contraseña?',
  forgotInstructions:
    'Pide al administrador de tu negocio que restablezca tu contraseña desde Usuarios. Si eres el propietario y no tienes otro administrador, contacta a Syntra:',
  firstTime: '¿Es tu primera vez?',
  createBusiness: 'Crear una empresa',
};

const DEFAULT_THEME: Required<LoginTheme> = {
  background: '#102A43',
  inputLight: '#EAF1FB',
  inputDark: '#0F273D',
  inputDarkBorder: '#1F3A54',
  primary: '#4CADEE',
  primaryHover: '#3D9FE2',
  text: '#FFFFFF',
  mutedText: '#8FA6BC',
  error: '#F0A8A2',
};

const DEFAULT_LOGO = require('../assets/logo_wordmark_dark.png');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginScreen({
  onSignIn,
  onCreateBusiness,
  onForgotPassword,
  logoSource = DEFAULT_LOGO,
  support,
  text: textOverrides,
  theme: themeOverrides,
  style,
  minimumPhoneDigits = 10,
  testID = 'syntra-login',
}: LoginScreenProps) {
  const text = useMemo(() => ({ ...DEFAULT_TEXT, ...textOverrides }), [textOverrides]);
  const theme = useMemo(() => ({ ...DEFAULT_THEME, ...themeOverrides }), [themeOverrides]);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForgotHelp, setShowForgotHelp] = useState(false);

  async function handleSubmit() {
    const value = identifier.trim();
    if (!value || !password) {
      setError('Ingresa tu correo o teléfono, y tu contraseña.');
      return;
    }
    if (!value.includes('@') && value.replace(/\D/g, '').length < minimumPhoneDigits) {
      setError('Ingresa un teléfono válido o un correo.');
      return;
    }
    if (value.includes('@') && !EMAIL_RE.test(value)) {
      setError('Ingresa un correo válido.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const result = await onSignIn(value, password);
      if (result.error) setError(result.error);
    } catch {
      setError('No fue posible iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleForgotPassword() {
    if (onForgotPassword) {
      onForgotPassword(identifier.trim());
      return;
    }
    setShowForgotHelp((current) => !current);
  }

  const whatsappUrl = support?.whatsappPhone
    ? `https://wa.me/${support.whatsappPhone}?text=${encodeURIComponent(
        support.recoveryMessage ?? 'Hola, necesito ayuda para recuperar el acceso a mi cuenta de Syntra.',
      )}`
    : null;

  return (
    <KeyboardAvoidingView
      testID={testID}
      style={[styles.screen, { backgroundColor: theme.background }, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <Image source={logoSource} style={styles.logo} contentFit="contain" accessibilityLabel="Syntra" />
        <Text style={[styles.subtitle, { color: theme.mutedText }]}>{text.subtitle}</Text>

        <TextInput
          value={identifier}
          onChangeText={setIdentifier}
          placeholder={text.identifierPlaceholder}
          placeholderTextColor="#8B98A1"
          autoCapitalize="none"
          autoComplete="username"
          keyboardType="email-address"
          style={[styles.input, { backgroundColor: theme.inputLight, color: '#1F2933' }]}
          editable={!submitting}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder={text.passwordPlaceholder}
          placeholderTextColor="#5C7690"
          secureTextEntry
          autoComplete="password"
          style={[
            styles.input,
            { backgroundColor: theme.inputDark, borderColor: theme.inputDarkBorder, color: theme.text },
          ]}
          editable={!submitting}
          onSubmitEditing={handleSubmit}
        />

        {error ? <Text style={[styles.error, { color: theme.error }]}>{error}</Text> : null}

        <Pressable
          accessibilityRole="button"
          disabled={submitting}
          onPress={handleSubmit}
          style={({ pressed, hovered }: any) => [
            styles.button,
            { backgroundColor: hovered ? theme.primaryHover : theme.primary },
            pressed && styles.buttonPressed,
            submitting && styles.buttonDisabled,
          ]}>
          {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>{text.submit}</Text>}
        </Pressable>

        <Pressable accessibilityRole="button" onPress={handleForgotPassword} style={styles.forgotLink}>
          <Text style={[styles.forgotLinkText, { color: theme.mutedText }]}>{text.forgotPassword}</Text>
        </Pressable>

        {!onForgotPassword && showForgotHelp ? (
          <View style={[styles.forgotBox, { backgroundColor: theme.inputDark, borderColor: theme.inputDarkBorder }]}>
            <Text style={styles.forgotBoxText}>{text.forgotInstructions}</Text>
            {whatsappUrl ? (
              <Pressable onPress={() => void Linking.openURL(whatsappUrl)}>
                <Text style={[styles.forgotBoxLink, { color: theme.primary }]}>WhatsApp {support?.displayPhone}</Text>
              </Pressable>
            ) : null}
            {support?.email ? (
              <Pressable onPress={() => void Linking.openURL(`mailto:${support.email}`)}>
                <Text style={[styles.forgotBoxLink, { color: theme.primary }]}>{support.email}</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {onCreateBusiness ? (
          <View style={styles.registerBlock}>
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>{text.firstTime}</Text>
              <View style={styles.divider} />
            </View>
            <Pressable onPress={onCreateBusiness} style={styles.registerButton}>
              <Text style={styles.registerButtonText}>{text.createBusiness}</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  content: { width: '100%', maxWidth: 420, alignItems: 'center' },
  logo: { width: 300, height: 99, marginBottom: 24 },
  subtitle: { fontSize: 15, fontWeight: '600', textAlign: 'center', marginBottom: 32 },
  input: { width: '100%', height: 58, borderRadius: 14, paddingHorizontal: 18, fontSize: 15, marginBottom: 16, borderWidth: 1 },
  error: { width: '100%', fontSize: 13, marginBottom: 8 },
  button: { width: '100%', height: 58, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  buttonPressed: { transform: [{ scale: 0.99 }] },
  buttonDisabled: { opacity: 0.75 },
  buttonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  forgotLink: { marginTop: 16, alignSelf: 'center' },
  forgotLinkText: { fontSize: 13, fontWeight: '600', textDecorationLine: 'underline' },
  forgotBox: { width: '100%', marginTop: 8, padding: 16, borderRadius: 12, borderWidth: 1, gap: 6 },
  forgotBoxText: { color: '#B7C6D6', fontSize: 12.5, lineHeight: 18 },
  forgotBoxLink: { fontSize: 13, fontWeight: '700' },
  registerBlock: { width: '100%', marginTop: 24, gap: 16 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { flex: 1, height: 1, backgroundColor: '#28445D' },
  dividerText: { color: '#7890A6', fontSize: 12, fontWeight: '600' },
  registerButton: { width: '100%', height: 54, borderRadius: 14, borderWidth: 1, borderColor: '#426078', alignItems: 'center', justifyContent: 'center' },
  registerButtonText: { color: '#DCEAF5', fontSize: 15, fontWeight: '800' },
});
