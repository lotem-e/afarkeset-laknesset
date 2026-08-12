import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Vite config: React for components, Tailwind v4 via its Vite plugin
// ( same setup as the other Personal/ projects ). The dev port is passed
// from the workspace .claude/launch.json, so it is not pinned here.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
