const path = require("path");

module.exports = {
  entry: "./src/js/main.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "datepicker.esm.js",
    libraryTarget: "module", // Set as an ES module
    module: true, // Required for ES modules
  },
  experiments: {
    outputModule: true, // Enables module output
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js"],
  },
  mode: "production",
};
