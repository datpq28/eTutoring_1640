import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.VITE_PORT), // Luôn lấy từ .env hoặc mặc định là 3000
    strictPort: true, // ⚠️ Quan trọng: Không tự động đổi cổng
  }
});
