import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const config = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: ["public/r/**"]
  },
  {
    rules: {
      // Next 16 / react-hooks 7 flags many valid animation init patterns in loaders.
      "react-hooks/set-state-in-effect": "off"
    }
  }
];

export default config;
