const {Fragment, Creator} = require('./mongooseSchema');

module.exports = {
	findFragment: (query={}) => {
		console.log(query);
		return Fragment.find(query);
	},

	createFragment: (query) => {
		const fragment = new Fragment(query);
		return fragment.save();
	},

	findCreator: (query={}) => {
		console.log(query);
		return Creator.find(query);
	},

	createCreator: (query) => {
		const fragment = new Creator(query);
		return fragment.save();
	},
};
