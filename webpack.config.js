module.exports = {
  entry: "./src/index.ts",
  devServer: {
    contentBase: "./dist",
    // 允许外网访问
    host: "0.0.0.0",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
};
