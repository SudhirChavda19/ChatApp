import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // sw: {
  //   build: {
  //     outdir: "./dist",
  //     lib: {
  //       entry: "./firebase-messaging-sw.js",
  //       fileName: "firebase-messaging-sw",
  //       formats: ["es"]
  //     },
  //     emptyOutDir: false
  //   }
  // },
})
