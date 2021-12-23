module.exports = {
  entry: "./src/index.js",
  devServer: {
    contentBase: "./dist",
    // 允许外网访问
    host: "0.0.0.0",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
};
