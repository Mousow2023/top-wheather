// webpack.prod.js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "production",
    devtool: "source-map", // Better debugging for production
    // performance: {
    //     hints: false, // Suppress performance hints
    // },
});
