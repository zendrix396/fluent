import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Disable everything by extending nothing and turning off all rules
  ...compat.config({
    rules: {
      // eslint-disable-all: turn off all known rules
    },
    ignores: ["**/*"], // ignore everything
  }),
];

export default eslintConfig;
