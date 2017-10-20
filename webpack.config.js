const path = require('path');

module.exports = {
	entry: './src/web-ui/index.js',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				}
			}
		]
	},
	devServer: {
		contentBase: './src/web-ui/static',
		proxy: {
			'/graphql': 'http://localhost:4000'
		}
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'sphinx.bundle.js',
	}
}
