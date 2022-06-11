import { terser } from "rollup-plugin-terser";

export default {
  input: "src/main.js",
  output: {
    dir: "dist",
    entryFileNames: "main.js",
    format: "es",
  },
  plugins: [
    terser({
      ecma: 5,
      format: { comments: false },
      compress: { pure_funcs: ["console.log"] },
    }),
  ],
};
