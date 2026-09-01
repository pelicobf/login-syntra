const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginInput(identifier: string, password: string, minimumPhoneDigits = 10): string | null {
  const value = identifier.trim();
  if (!value || !password) return 'Ingresa tu correo o teléfono, y tu contraseña.';
  if (!value.includes('@') && value.replace(/\D/g, '').length < minimumPhoneDigits) {
    return 'Ingresa un teléfono válido o un correo.';
  }
  if (value.includes('@') && !EMAIL_RE.test(value)) return 'Ingresa un correo válido.';
  return null;
}

export function supportWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
