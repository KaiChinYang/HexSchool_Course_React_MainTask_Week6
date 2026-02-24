import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  //開發中?已完成產品?
  base:
    process.env.NODE_ENV === "production"
      ? "/HexSchool_Course_React_MainTask_Week5/"
      : "/",
  plugins: [react()],
});
