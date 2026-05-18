import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202A",
        muted: "#667085",
        surface: "#F6F8FA",
        line: "#E5E7EB",
        rise: "#D92D20",
        fall: "#1570EF",
        good: "#039855",
        warn: "#DC6803"
      },
      boxShadow: {
        card: "0 8px 24px rgba(15, 23, 42, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
