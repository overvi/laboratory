const path = require("path");

module.exports = {
  entry: "./src/js/main.js", // Entry point for your application
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {},
  mode: "development",
};
