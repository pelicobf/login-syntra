import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  // Sólo para desarrollar contra la dependencia local file:..; un paquete
  // instalado desde npm o GitHub ya vive dentro de node_modules.
  server: { fs: { allow: [fileURLToPath(new URL('..', import.meta.url))] } },
});
