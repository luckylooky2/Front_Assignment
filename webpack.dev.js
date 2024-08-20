const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    port: 3000,
    hot: true,
    open: true,
    compress: true,
    static: { directory: path.join(__dirname, "/dist") },
    client: {
      logging: "info",
      overlay: true,
    },
  },
});
