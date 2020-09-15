import path = require('path');
import HtmlWebpackPlugin = require('html-webpack-plugin');
import applicationConfig = require('./config.json');

export default {
  entry: [path.join(path.resolve(__dirname, 'src'), 'mounter.tsx')],
  output: {
    filename: 'app.bundle.js',
    chunkFilename: 'chunk-[name].bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(path.resolve(__dirname, 'src'), 'index.html')
    })
  ],
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "sass-loader"
        }]
      },
      {
        test: /\.css$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'Resources/Fonts/'
          }
        }]
      },
      {
        test: /\.(png|jpeg|jpg|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'Resources/Images/'
          }
        }]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  devServer: {
    historyApiFallback: true,
  },
  mode: applicationConfig["MODE"]
};
