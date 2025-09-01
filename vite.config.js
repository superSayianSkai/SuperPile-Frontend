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
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,webp,jpeg}"],
        // Don't precache auth-related APIs
        navigateFallbackDenylist: [/\/api\/v1\/auth\//, /\/login/],
      },
      manifest: {
        name: "SupaPile",
        short_name: "SupaPile",
        start_url: "/?source=pwa",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000",
        icons: [
          {
            src: "./icons/supapile-icon-192x192webp.webp",
            sizes: "192x192",
            type: "image/webp"
          },
          {
            src: "./icons/supapile-icon-512512webp.webp",
            sizes: "512x512",
            type: "image/webp"
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
