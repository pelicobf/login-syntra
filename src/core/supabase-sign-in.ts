import type { SupabaseClient } from '@supabase/supabase-js';

import type { SignInHandler } from './types';

export type SupabaseSignInOptions = {
  phoneLookupRpc?: string;
  phoneParameter?: string;
  translateError?: (message: string) => string;
};

export function normalizePhone(value: string): string {
  return value.replace(/\D/g, '');
}

export function translateAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) return 'Correo, teléfono o contraseña incorrectos.';
  if (message.includes('Email not confirmed')) return 'La cuenta aún no está confirmada.';
  if (message.includes('Password should be at least')) return 'La contraseña es demasiado corta.';
  if (message.includes('Failed to fetch')) return 'No fue posible conectar con el servicio de acceso.';
  return message;
}

export function createSupabaseSignIn(
  supabase: SupabaseClient,
  options: SupabaseSignInOptions = {},
): SignInHandler {
  const {
    phoneLookupRpc = 'get_email_by_phone',
    phoneParameter = 'p_phone',
    translateError = translateAuthError,
  } = options;

  return async (identifier, password) => {
    let email = identifier.trim();
    if (!email.includes('@')) {
      const { data: resolvedEmail, error: lookupError } = await supabase.rpc(phoneLookupRpc, {
        [phoneParameter]: normalizePhone(email),
      });
      if (lookupError || typeof resolvedEmail !== 'string' || !resolvedEmail) {
        return { error: 'No encontramos una cuenta con ese teléfono.' };
      }
      email = resolvedEmail;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? translateError(error.message) : null };
  };
}
