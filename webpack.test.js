const path = require('path'),
	webpack = require('webpack'),
	CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	entry: {
		tests: './t/test.js',
		vendor: [
			'chai',
			'chai-as-promised',
		],
	},
	plugins: [
		new CleanWebpackPlugin(['public/test'], {
			exclude: ['test.html'],
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'runtime',
		}),
	],
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, './public/test'),
	},
	watch: true,
	devtool: 'inline-source-map',
};
