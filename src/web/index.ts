import './login.css';

export { LoginScreen } from './login-screen';
export type { LoginScreenProps } from './login-screen';
export { createSupabaseSignIn, normalizePhone, translateAuthError } from '../core/supabase-sign-in';
export type { SupabaseSignInOptions } from '../core/supabase-sign-in';
export type { LoginSupport, LoginText, LoginTheme, SignInHandler, SignInResult } from '../core/types';
