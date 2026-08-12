import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => ({
  // In dev the site lives at the domain root, exactly as before.
  // A production build is what GitHub Pages serves, and there the
  // site lives under /afarkeset-laknesset/ - so every asset URL
  // must carry that prefix. The base has to be absolute, not
  // "./": relative URLs break on deep routes like /bill/x, where
  // "./assets" would resolve inside /bill/.
  base: mode === "production" ? "/afarkeset-laknesset/" : "/",
  // tailwindcss() processes our CSS and generates utility classes.
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // "@" is a shortcut for the src folder.
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
