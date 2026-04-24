import type { Config } from "tailwindcss";

const dotmatrixPreset: Partial<Config> = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        dotmatrix: "hsl(var(--dotmatrix-color, 220 90% 56%))"
      },
      keyframes: {
        "dot-pulse": {
          "0%, 100%": { opacity: "0.22", transform: "scale(0.78)" },
          "50%": { opacity: "1", transform: "scale(1)" }
        },
        "dot-collapse": {
          "0%": { transform: "translate(var(--dmx-x, 0px), var(--dmx-y, 0px))" },
          "100%": { transform: "translate(0px, 0px)" }
        },
        "dot-ripple": {
          "0%": { opacity: "0.16", transform: "scale(0.7)" },
          "50%": { opacity: "1", transform: "scale(1.08)" },
          "100%": { opacity: "0.3", transform: "scale(0.86)" }
        },
        scanline: {
          "0%": { backgroundPosition: "0 -140%" },
          "100%": { backgroundPosition: "0 220%" }
        }
      },
      animation: {
        "dot-pulse": "dot-pulse calc(900ms * var(--dmx-speed, 1)) ease-in-out infinite",
        "dot-collapse":
          "dot-collapse calc(260ms * var(--dmx-speed, 1)) cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "dot-ripple": "dot-ripple calc(1000ms * var(--dmx-speed, 1)) ease-in-out infinite",
        scanline: "scanline calc(1800ms * var(--dmx-speed, 1)) linear infinite"
      }
    }
  }
};

const config: Config = {
  presets: [dotmatrixPreset],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./loaders/**/*.{ts,tsx}"]
};

export default config;
