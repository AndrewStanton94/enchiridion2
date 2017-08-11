const path = require('path');

module.exports = {
	entry: './t/test.js',
	output: {
		filename: 'tests.js',
		path: path.resolve(__dirname, './public/test'),
	},
	watch: true,
	devtool: 'inline-source-map',
};
