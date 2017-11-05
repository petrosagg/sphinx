const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/web-ui/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/web-ui/static/index.html',
      hash: true
    })
  ],
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/graphql': 'http://localhost:4000'
    }
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: 'sphinx.bundle.js'
  }
}
