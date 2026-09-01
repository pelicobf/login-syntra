import { LoginScreen } from '@syntra/login';

const DEMO_DELAY_MS = 700;

export function App() {
  return (
    <LoginScreen
      onSignIn={async (_identifier, password) => {
        await new Promise((resolve) => setTimeout(resolve, DEMO_DELAY_MS));
        if (password !== 'syntra123') return { error: 'Contraseña de demostración incorrecta. Usa syntra123.' };
        window.alert('Acceso simulado correctamente.');
        return { error: null };
      }}
      onCreateBusiness={() => window.alert('Aquí se abriría el registro de tu sistema.')}
      support={{
        whatsappPhone: '522221852658',
        displayPhone: '+52 222 185 2658',
        email: 'contacto@syntrasoftware.com.mx',
      }}
    />
  );
}
