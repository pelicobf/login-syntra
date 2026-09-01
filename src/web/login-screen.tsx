import { useMemo, useState, type CSSProperties, type FormEvent } from 'react';

import { resolveLoginText, resolveLoginTheme } from '../core/config';
import type { LoginScreenBaseProps } from '../core/types';
import { supportWhatsAppUrl, validateLoginInput } from '../core/validation';
import defaultLogo from '../../assets/logo_wordmark_dark.png';

const DEFAULT_LOGO = defaultLogo;

export type LoginScreenProps = LoginScreenBaseProps & {
  logoSource?: string;
  className?: string;
  style?: CSSProperties;
};

export function LoginScreen({
  onSignIn,
  onCreateBusiness,
  onForgotPassword,
  logoSource = DEFAULT_LOGO,
  support,
  text: textOverrides,
  theme: themeOverrides,
  className,
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

  const customProperties = {
    '--syntra-login-background': theme.background,
    '--syntra-login-input-light': theme.inputLight,
    '--syntra-login-input-dark': theme.inputDark,
    '--syntra-login-input-border': theme.inputDarkBorder,
    '--syntra-login-primary': theme.primary,
    '--syntra-login-primary-hover': theme.primaryHover,
    '--syntra-login-text': theme.text,
    '--syntra-login-muted': theme.mutedText,
    '--syntra-login-error': theme.error,
    ...style,
  } as CSSProperties;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
    <main className={`syntra-login-screen${className ? ` ${className}` : ''}`} style={customProperties} data-testid={testID}>
      <section className="syntra-login-content" aria-label="Inicio de sesión de Syntra">
        <img className="syntra-login-logo" src={logoSource} alt="Syntra Software" />
        <p className="syntra-login-subtitle">{text.subtitle}</p>

        <form className="syntra-login-form" onSubmit={handleSubmit} noValidate>
          <label className="syntra-login-visually-hidden" htmlFor={`${testID}-identifier`}>{text.identifierPlaceholder}</label>
          <input
            id={`${testID}-identifier`}
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder={text.identifierPlaceholder}
            autoCapitalize="none"
            autoComplete="username"
            disabled={submitting}
          />
          <label className="syntra-login-visually-hidden" htmlFor={`${testID}-password`}>{text.passwordPlaceholder}</label>
          <input
            id={`${testID}-password`}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={text.passwordPlaceholder}
            autoComplete="current-password"
            disabled={submitting}
          />
          {error ? <p className="syntra-login-error" role="alert">{error}</p> : null}
          <button className="syntra-login-submit" type="submit" disabled={submitting}>
            {submitting ? <><span className="syntra-login-spinner" aria-hidden="true" />{text.submitting}</> : text.submit}
          </button>
        </form>

        <button className="syntra-login-forgot" type="button" onClick={handleForgotPassword}>{text.forgotPassword}</button>
        {!onForgotPassword && showForgotHelp ? (
          <div className="syntra-login-help">
            <p>{text.forgotInstructions}</p>
            {support?.whatsappPhone ? (
              <a href={supportWhatsAppUrl(support.whatsappPhone, recoveryMessage)} target="_blank" rel="noreferrer">
                WhatsApp {support.displayPhone ?? support.whatsappPhone}
              </a>
            ) : null}
            {support?.email ? <a href={`mailto:${support.email}`}>{support.email}</a> : null}
          </div>
        ) : null}

        {onCreateBusiness ? (
          <div className="syntra-login-register">
            <div><span /><b>{text.firstTime}</b><span /></div>
            <button type="button" onClick={onCreateBusiness}>{text.createBusiness}</button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
