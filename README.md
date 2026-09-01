# @syntra/login

Login reutilizable de Syntra para aplicaciones React Native y Expo. Incluye la pantalla, validación de correo/teléfono, recuperación de acceso, registro opcional y un adaptador para Supabase.

## Demo visual

Instala las dependencias del ejemplo una sola vez y levanta Expo Web:

```bash
npm run demo:install
npm run demo:web
```

Abre la dirección que muestre Expo, normalmente `http://localhost:8081`. Puedes usar cualquier correo válido y la contraseña `syntra123`; la autenticación es simulada y no modifica datos reales.

## Instalación local

```json
{
  "dependencies": {
    "@syntra/login": "file:../repository_utility/login-syntra"
  }
}
```

La aplicación consumidora debe tener `react`, `react-native` y `expo-image`. Si usa el adaptador incluido, también debe tener `@supabase/supabase-js`.

## Uso con Supabase

```tsx
import { LoginScreen, createSupabaseSignIn } from '@syntra/login';
import { useMemo } from 'react';

import { supabase } from '@/lib/supabase';

export function Login() {
  const signIn = useMemo(() => createSupabaseSignIn(supabase), []);

  return (
    <LoginScreen
      onSignIn={signIn}
      onCreateBusiness={() => router.push('/registro')}
      support={{
        whatsappPhone: '522221852658',
        displayPhone: '+52 222 185 2658',
        email: 'contacto@syntrasoftware.com.mx',
      }}
    />
  );
}
```

Por defecto el adaptador acepta correo o teléfono. Para teléfonos invoca el RPC `get_email_by_phone` con el parámetro `p_phone`, igual que Syntra POS. Ambos nombres se pueden configurar:

```ts
createSupabaseSignIn(supabase, {
  phoneLookupRpc: 'resolve_login_email',
  phoneParameter: 'phone',
});
```

## Uso con cualquier backend

```tsx
<LoginScreen
  onSignIn={async (identifier, password) => {
    const response = await api.login({ identifier, password });
    return { error: response.ok ? null : response.message };
  }}
  onForgotPassword={(identifier) => router.push({ pathname: '/recuperar', params: { identifier } })}
/>
```

`LoginScreen` también permite sustituir `logoSource`, textos, colores, soporte y el mínimo de dígitos del teléfono. No crea ni conserva sesiones por sí mismo: esa responsabilidad sigue perteneciendo al cliente de autenticación de cada aplicación.
