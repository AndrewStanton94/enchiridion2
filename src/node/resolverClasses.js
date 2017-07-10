const mongooseQueries = require('./mongooseQueries');

let FragmentResolver = class {
		/**
		 *	This may allow graphQL to resolve nested documents
		 *	@param {ID!} _id The id of an existing Fragment
		 *	@param {ID!} dataType What representation of the data in required?
		*/
		constructor(_id, dataType) {
			this._id = _id;
			this.dataType = dataType;
		}

		name() {
			return new Promise((resolve, reject) => {
				let query = {};
				if (this._id) {
					query._id = this._id;
				}
				mongooseQueries.findFragment(query).then((input) => input[0])
				.then((fragment) => {
				// console.log(`Resolving fragment ${this._id}/name: ${fragment.name}`);
					resolve(fragment.name);
				});
			});
		}

		creators() {
			console.log(`Resolving fragment ${this._id}/creators`);
			return new Promise((resolve, reject) => {
				let query = {};
				if (this._id) {
					query._id = this._id;
				}
				mongooseQueries.findFragment(query).then((input) => input[0])
				.then((fragment) => {
					console.log(fragment);
					// resolve(fragment.creators);
					// resolve([{
					// 	'name': 'Me',
					// 	'languages': ['Eng', 'pcm'],
					// 	'formats': ['txt', 'ph'],
					// 	'created': null,
					// }]);
					// resolve(new CreatorResolver(fragment.creators[0]));
					resolve(fragment.creators.map((_id) => {
						const creator = new CreatorResolver(_id);
						return creator.getCreator();
					}));
				});
			});
		}
	},

	CreatorResolver = class {
		constructor(_id) {
			this._id = _id;
			console.log(`Resolving Creator ${this._id}`);
		}

		getCreator() {
			return new Promise((resolve, reject) => {
				console.log('Resolving a creator');
				let query = {};
				if (this._id) {
					query._id = this._id;
				}
				mongooseQueries.findCreator(query).then((input) => input[0])
				.then((creator) => {
					console.log(creator);
					resolve(creator);
				});
			});
		}

		name() {
			console.log(`Resolving Creator ${this._id}/name`);
			return 'Edmund';
		}

		languages() {
			return ['Eng', 'pcm'];
		}

		formats() {
			return ['txt', 'ph'];
		}
	}
;

module.exports = {
	FragmentResolver,
	CreatorResolver,
};
