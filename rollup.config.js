const { join } = require("path");
const fg = require("fast-glob");

// A Rollup plugin to minify generated ES bundles. Uses terser under the hood.
const { terser } = require("rollup-plugin-terser");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const del = require("rollup-plugin-delete");
const brotli = require("rollup-plugin-brotli");
const { generateSW } = require("rollup-plugin-workbox");

const commonjs = require("@rollup/plugin-commonjs");

const pagesDir = "./src/lib/pages/**.js";

const ssrDir = "./src/lib/render-utils/**.js";
const pages = fg.sync([join(pagesDir), join(ssrDir)], {
  onlyFiles: true,
  ignore: [],
  unique: true,
});
const inputs = ["./src/lib/app.js", "./src/lib/components/base.js", "./src/lib/service-worker.js"];

const plugins = [
  nodeResolve(),
  commonjs(),
  generateSW({
    swDest: "dist/js/service-worker.js",
    globDirectory: "dist/js",
  }),
];

const devConfig = {
  input: [...inputs, ...pages],
  output: {
    dir: "dist/js",
    format: "esm",
  },
  watch: {
    // By default rollup clears the console on every build. This disables that.
    clearScreen: false,
  },
  plugins: [...plugins, del({ targets: "dist/js" })],
};

const productionConfig = {
  input: [...inputs, ...pages],
  output: {
    dir: "dist/js",
    format: "esm",
  },
  plugins: [
    ...plugins,
    brotli(),
    terser({
      format: {
        // Remove all comments, including @license comments,
        // otherwise LHCI complains at us.
        comments: false,
      },
    }),
  ],
};

export default () => {
  switch (process.env.NODE_ENV) {
    case "production":
      return productionConfig;
    default:
      return devConfig;
  }
};
