import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // tailwindcss() processes our CSS and generates utility classes.
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // "@" is a shortcut for the src folder.
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
