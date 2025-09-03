import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      strategies: "injectManifest",
      srcDir: "public",
      filename: "service-worker.js",
      injectRegister: 'auto',
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg,json,woff2}"
        ],
        cleanupOutdatedCaches: true,
        sourcemap: true,
        navigateFallbackDenylist: [/\/api\/v1\/auth\//, /\/login/],
      },
      manifest: {
        name: "SupaPile",
        short_name: "SupaPile",
        description: "SupaPile - Your Personal Link Manager",
        start_url: "/?source=pwa",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "/icons/supapile-128.png",
            sizes: "128x128",
            type: "image/png"
          },
          {
            src: "/icons/supapile-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons/supapile-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    }),
  ],
  server: {
    port: 2000,
    host: "0.0.0.0",
  },
});