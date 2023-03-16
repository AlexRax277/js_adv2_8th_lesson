const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    index: {
      import: './src/index.js',
    },
    chat: {
      import: './src/app/chatWin.js',
      dependOn: 'index',
    },
  },
  optimization: {
    runtimeChunk: 'single',
  },
  target: 'web',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/'),
    publicPath: 'auto',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader',
        ],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset',
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: 'index',
    }),
    new HtmlWebPackPlugin({
      template: './src/chat.html',
      filename: 'chat.html',
      chunks: 'chat',
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
  ],
  stats: {
    children: true,
  },
};
