import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  entry: "./src/index.ts",
  mode: "production",
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".ts", ".js"],
  },
  output: {
    filename: "index.js",
    path: resolve(__dirname, "dist"),
    clean: true,
  },
};
