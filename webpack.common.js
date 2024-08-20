const path = require("path");

module.exports = {
  resolve: {
    extensions: [".js", ".jsx"],
  },
  entry: { app: "./index.jsx" },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "/dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react"],
        },
        exclude: path.join(__dirname, "node_modules"),
      },
    ],
  },
};
