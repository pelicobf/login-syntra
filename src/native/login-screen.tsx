import { Image, type ImageSource } from 'expo-image';
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
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { resolveLoginText, resolveLoginTheme } from '../core/config';
import type { LoginScreenBaseProps } from '../core/types';
import { supportWhatsAppUrl, validateLoginInput } from '../core/validation';

const DEFAULT_LOGO = require('../../assets/logo_wordmark_dark.png');

export type LoginScreenProps = LoginScreenBaseProps & {
  logoSource?: ImageSource;
  style?: StyleProp<ViewStyle>;
};

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
  const text = useMemo(() => resolveLoginText(textOverrides), [textOverrides]);
  const theme = useMemo(() => resolveLoginTheme(themeOverrides), [themeOverrides]);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForgotHelp, setShowForgotHelp] = useState(false);

  async function handleSubmit() {
    const validationError = validateLoginInput(identifier, password, minimumPhoneDigits);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const result = await onSignIn(identifier.trim(), password);
      if (result.error) setError(result.error);
    } catch (cause) {
      setError(cause instanceof Error && cause.message ? cause.message : 'No fue posible iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleForgotPassword() {
    if (onForgotPassword) onForgotPassword(identifier.trim());
    else setShowForgotHelp((current) => !current);
  }

  const recoveryMessage = support?.recoveryMessage ?? 'Hola, necesito ayuda para recuperar el acceso a mi cuenta de Syntra.';

  return (
    <KeyboardAvoidingView
      testID={testID}
      style={[styles.screen, { backgroundColor: theme.background }, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <Image source={logoSource} style={styles.logo} contentFit="contain" accessibilityLabel="Syntra Software" />
        <Text style={[styles.subtitle, { color: theme.mutedText }]}>{text.subtitle}</Text>
        <TextInput
          value={identifier}
          onChangeText={setIdentifier}
          placeholder={text.identifierPlaceholder}
          placeholderTextColor="#8B98A1"
          autoCapitalize="none"
          autoComplete="username"
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
          style={[styles.input, { backgroundColor: theme.inputDark, borderColor: theme.inputDarkBorder, color: theme.text }]}
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
            {support?.whatsappPhone ? (
              <Pressable onPress={() => void Linking.openURL(supportWhatsAppUrl(support.whatsappPhone!, recoveryMessage))}>
                <Text style={[styles.forgotBoxLink, { color: theme.primary }]}>WhatsApp {support.displayPhone ?? support.whatsappPhone}</Text>
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
            <View style={styles.dividerRow}><View style={styles.divider} /><Text style={styles.dividerText}>{text.firstTime}</Text><View style={styles.divider} /></View>
            <Pressable onPress={onCreateBusiness} style={styles.registerButton}><Text style={styles.registerButtonText}>{text.createBusiness}</Text></Pressable>
          </View>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  content: { width: '100%', maxWidth: 420, alignItems: 'center' },
  logo: { width: 300, maxWidth: '100%', height: 99, marginBottom: 24 },
  subtitle: { fontSize: 15, fontWeight: '600', textAlign: 'center', marginBottom: 32 },
  input: { width: '100%', height: 58, borderRadius: 14, paddingHorizontal: 18, fontSize: 15, marginBottom: 16, borderWidth: 1 },
  error: { width: '100%', fontSize: 13, marginBottom: 8 },
  button: { width: '100%', height: 58, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  buttonPressed: { transform: [{ scale: 0.99 }] },
  buttonDisabled: { opacity: 0.75 },
  buttonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  forgotLink: { minHeight: 44, marginTop: 9, paddingHorizontal: 10, alignSelf: 'center', justifyContent: 'center' },
  forgotLinkText: { fontSize: 13, fontWeight: '600', textDecorationLine: 'underline' },
  forgotBox: { width: '100%', marginTop: 4, padding: 16, borderRadius: 12, borderWidth: 1, gap: 6 },
  forgotBoxText: { color: '#B7C6D6', fontSize: 12.5, lineHeight: 18 },
  forgotBoxLink: { fontSize: 13, fontWeight: '700' },
  registerBlock: { width: '100%', marginTop: 14, gap: 16 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { flex: 1, height: 1, backgroundColor: '#28445D' },
  dividerText: { color: '#7890A6', fontSize: 12, fontWeight: '600' },
  registerButton: { width: '100%', height: 54, borderRadius: 14, borderWidth: 1, borderColor: '#426078', alignItems: 'center', justifyContent: 'center' },
  registerButtonText: { color: '#DCEAF5', fontSize: 15, fontWeight: '800' },
});
