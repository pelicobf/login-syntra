import type { ImageSource } from 'expo-image';
import type { StyleProp, ViewStyle } from 'react-native';

export type SignInResult = { error: string | null };
export type SignInHandler = (identifier: string, password: string) => Promise<SignInResult>;

export type LoginSupport = {
  whatsappPhone?: string;
  displayPhone?: string;
  email?: string;
  recoveryMessage?: string;
};

export type LoginText = Partial<{
  subtitle: string;
  identifierPlaceholder: string;
  passwordPlaceholder: string;
  submit: string;
  forgotPassword: string;
  forgotInstructions: string;
  firstTime: string;
  createBusiness: string;
}>;

export type LoginTheme = Partial<{
  background: string;
  inputLight: string;
  inputDark: string;
  inputDarkBorder: string;
  primary: string;
  primaryHover: string;
  text: string;
  mutedText: string;
  error: string;
}>;

export type LoginScreenProps = {
  onSignIn: SignInHandler;
  onCreateBusiness?: () => void;
  onForgotPassword?: (identifier: string) => void;
  logoSource?: ImageSource;
  support?: LoginSupport;
  text?: LoginText;
  theme?: LoginTheme;
  style?: StyleProp<ViewStyle>;
  minimumPhoneDigits?: number;
  testID?: string;
};
