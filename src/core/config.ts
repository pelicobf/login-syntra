import type { LoginText, LoginTheme } from './types';

export const DEFAULT_TEXT: Required<LoginText> = {
  subtitle: 'Panel de negocio / super-admin',
  identifierPlaceholder: 'Correo o teléfono',
  passwordPlaceholder: '••••••••',
  submit: 'Entrar',
  submitting: 'Verificando…',
  forgotPassword: '¿Olvidaste tu contraseña?',
  forgotInstructions:
    'Pide al administrador de tu negocio que restablezca tu contraseña desde Usuarios. Si eres el propietario y no tienes otro administrador, contacta a Syntra:',
  firstTime: '¿Es tu primera vez?',
  createBusiness: 'Crear una empresa',
};

export const DEFAULT_THEME: Required<LoginTheme> = {
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

export function resolveLoginText(overrides?: LoginText): Required<LoginText> {
  return { ...DEFAULT_TEXT, ...overrides };
}

export function resolveLoginTheme(overrides?: LoginTheme): Required<LoginTheme> {
  return { ...DEFAULT_THEME, ...overrides };
}
