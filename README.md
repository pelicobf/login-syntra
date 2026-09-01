# @syntra/login

Login multiplataforma de Syntra para React web y React Native/Expo. Incluye implementaciones específicas por plataforma, validación compartida, recuperación de acceso, registro opcional y un adaptador para Supabase.

El mismo import selecciona automáticamente HTML/CSS en bundlers web y componentes nativos en Expo:

```tsx
import { LoginScreen } from '@syntra/login';
```

## Demo visual

Instala las dependencias del ejemplo una sola vez y levanta Vite:

```bash
npm run demo:install
npm run demo:web
```

Abre la dirección que muestre Vite, normalmente `http://localhost:5173`. Puedes usar cualquier correo válido y la contraseña `syntra123`; la autenticación es simulada y no modifica datos reales.

## Instalación local

```json
{
  "dependencies": {
    "@syntra/login": "file:../repository_utility/login-syntra"
  }
}
```

Todos los consumidores deben tener `react`. Las aplicaciones Expo deben tener además `react-native` y `expo-image`; los proyectos web no necesitan instalarlos. Si se usa el adaptador incluido, el proyecto debe tener `@supabase/supabase-js`.

También existen rutas explícitas como respaldo para bundlers que no seleccionen condiciones automáticamente:

```tsx
import { LoginScreen } from '@syntra/login/web';
import { LoginScreen } from '@syntra/login/native';
```

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
