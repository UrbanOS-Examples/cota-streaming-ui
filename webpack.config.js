const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use:  [  'style-loader', MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: "[path][name].[hash].[ext]"
            }
          }
        ]
      }
      // {
      //   test: /\.(svg)$/,
      //   exclude: /fonts/, /* dont want svg fonts from fonts folder to be included */
      //   use: [
      //     {
      //       loader: 'svg-url-loader',
      //       options: {
      //         noquotes: true,
      //       },
      //     },
      //   ],
      // }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      inject: false,
      hash: true,
      template: "./src/index.html",
      filename: "index.html"
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    })
  ]
};
