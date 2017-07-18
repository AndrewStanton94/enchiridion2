const path = require('path');

module.exports = {
	entry: './src/browserClient/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, './public/js'),
	},
	watch: true,
	devtool: 'inline-source-map',
};
