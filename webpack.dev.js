const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devServer: {
    static: "./dist",
    open: true,
    port: 8080,
    hot: true,
  },
  devtool: "source-map",
});
