const ESLintPlugin = require('eslint-webpack-plugin');
const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
    hot: true,
    open: false,
    compress: true,
    client: {
      logging: 'info',
      overlay: true,
    },
  },
  plugins: [
    new ESLintPlugin({
      emitWarning: true,
      extensions: ['js', 'jsx'],
      exclude: 'node_modules',
    }),
  ],
});
