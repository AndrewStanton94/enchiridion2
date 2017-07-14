const {Fragment, Creator} = require('./mongooseSchema');

module.exports = {
	findFragment: (query={}) => {
		// console.log('findFragment query:');
		// console.log(query);
		return Fragment.find(query).then((input) => input[0]);
	},

	createFragment: (query) => {
		const fragment = new Fragment(query);
		return fragment.save();
	},

	findCreator: (query={}) => {
		console.log('findCreator query:');
		console.log(query);
		return Creator.find(query).then((input) => input[0]);
	},

	createCreator: (query) => {
		const fragment = new Creator(query);
		return fragment.save();
	},
};
