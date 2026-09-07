/** @type {import('tailwindcss').Config} */

// رنگ‌های تم‌پذیر از طریق CSS Variables (پشتیبانی تم روشن/تیره)
const withVar = (name) => `rgb(var(${name}) / <alpha-value>)`;

module.exports = {
  content: ["./index.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        // زمینه — اسلیت سرد (تیره: نیمه‌شب، روشن: مه‌آلود آبی)
        ink: {
          950: withVar("--ink-950"),
          900: withVar("--ink-900"),
          800: withVar("--ink-800"),
          700: withVar("--ink-700"),
          600: withVar("--ink-600"),
        },
        // لهجه یشم / تیل (ثابت در هر دو تم)
        amber: {
          200: "#B8F5E8",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0F9B8A",
        },
        copper: {
          400: "#4DB8A8",
          500: "#1F8A7A",
        },
        // متن — در تم تیره مه سرد، در تم روشن اسلیت عمیق
        cream: {
          DEFAULT: withVar("--cream"),
          dim: withVar("--cream-dim"),
          mute: withVar("--cream-mute"),
        },
      },
      fontFamily: {
        vazir: ['"Vazirmatn FD"', "Tahoma", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(232,240,244,0.06) inset, 0 24px 60px -12px rgba(0,0,0,0.55), 0 4px 16px -4px rgba(0,0,0,0.4)",
        glow: "0 0 0 1px rgba(45,212,191,0.28), 0 8px 40px -8px rgba(20,184,166,0.38)",
        btn: "0 1px 0 0 rgba(255,255,255,0.22) inset, 0 10px 30px -10px rgba(20,184,166,0.55)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "out-soft": "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
      keyframes: {
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        float: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(4%, -6%, 0) scale(1.08)" },
        },
        "float-alt": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1.05)" },
          "50%": { transform: "translate3d(-5%, 5%, 0) scale(0.95)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(0.8)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(50%)" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 14s linear infinite",
        float: "float 18s ease-in-out infinite",
        "float-alt": "float-alt 22s ease-in-out infinite",
        "pulse-dot": "pulse-dot 2.2s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};
