import { LoginScreen } from '@syntra/login';
import { StatusBar } from 'expo-status-bar';
import { Alert } from 'react-native';

const DEMO_DELAY_MS = 700;

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <LoginScreen
        onSignIn={async (identifier, password) => {
          await new Promise((resolve) => setTimeout(resolve, DEMO_DELAY_MS));
          if (password !== 'syntra123') {
            return { error: 'Contraseña de demostración incorrecta. Usa syntra123.' };
          }
          Alert.alert('Acceso correcto', `Sesión simulada para ${identifier}`);
          return { error: null };
        }}
        onCreateBusiness={() => Alert.alert('Crear empresa', 'Aquí se abriría el registro de tu sistema.')}
        support={{
          whatsappPhone: '522221852658',
          displayPhone: '+52 222 185 2658',
          email: 'contacto@syntrasoftware.com.mx',
        }}
      />
    </>
  );
}
