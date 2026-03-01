import { defineConfig } from "vitest/config"; //set up the Vitest settings
import react from "@vitejs/plugin-react"; //vite plugin for React support

export default defineConfig({
  plugins: [react()], //tell Vite to use React plugin
  test: {
    environment: "jsdom",
    globals: true,     // can write except/test without importing in every file     
    setupFiles: "./src/test/setup.ts", //file to run before each test, for setting up testing environment 
  },
});