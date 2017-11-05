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
    new HtmlWebpackPlugin({ hash: true, title: 'Sphinx' })
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
