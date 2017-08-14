const path = require('path'),
	webpack = require('webpack'),
	CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	entry: {
		bundle: './src/browserClient/index.js',
	},
	plugins: [
		new CleanWebpackPlugin(['public/js']),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'runtime',
		}),
	],
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, './public/js'),
	},
	watch: true,
	devtool: 'inline-source-map',
};
