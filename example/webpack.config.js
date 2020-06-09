const path = require("path");

module.exports = {
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  entry: path.resolve(__dirname, "src", "index.js"),
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(tsx?|js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
};
