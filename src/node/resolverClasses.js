const mongooseQueries = require('./mongooseQueries'),
	getFragmentAttribute = (self, attribute) =>
		new Promise((resolve, reject) => {
			let query = {};
			if (self._id) {
				query._id = self._id;
			}
			mongooseQueries.findFragment(query)
			.then((fragment) => {
			console.log(`Resolving fragment ${self._id}/${attribute}: ${fragment[attribute]}`);
				resolve(fragment[attribute]);
			});
		}),

	FragmentResolver = class {
		/**
		 *	This class has separate methods to resolve each attribute.
		 * Needed to handle the [Creator] for GraphlQL
		 * @todo Find a way of pointing the creators IDs out to CreatorResolver
		 * @param {ID!} _id The id of an existing Fragment
		 * @param {dataType} dataType What representation of the data in required?
		*/
		constructor(_id, dataType) {
			this._id = _id;
			this.dataType = dataType;
		}

		/**
		 * @return {name} Resolves to Fragment name
		 */
		name() {
			return getFragmentAttribute(this, 'name');
		}

		/**
		 * @return {[delta]} Resolves to Fragment deltas
		 */
		deltas() {
			return getFragmentAttribute(this, 'deltas');
		}

		/**
		 * @return {data} Resolves to Fragment data
		 */
		async data() {
			let data = await getFragmentAttribute(this, 'data');
			if (this.dataType) {
				data = data[this.dataType];
			}
			console.log(`Resolving fragment ${this._id}/data[${this.dataType}]: ${data}`);
			return data;
		}

		/**
		 * @return {[Creator]} Resolves to a list of Creators
		 */
		creators() {
			console.log(`Resolving fragment ${this._id}/creators`);
			return new Promise((resolve, reject) => {
				let query = {};
				if (this._id) {
					query._id = this._id;
				}
				mongooseQueries.findFragment(query)
				.then((fragment) => {
					console.log(fragment);
					resolve(fragment.creators.map((_id) => {
						const creator = new CreatorResolver(_id);
						return creator.getCreator();
					}));
				});
			});
		}
	},

	/**
	 * @class CreatorResolver
	 * Gets information about a Creator
	 */
	CreatorResolver = class {
		/**
		 * @param {ID} _id Unique Creator ID
		 */
		constructor(_id) {
			this._id = _id;
		}

		/**
		 * @return {Creator} Resolves creator data from database
		 */
		getCreator() {
			return new Promise((resolve, reject) => {
				console.log(`Resolving Creator ${this._id}`);
				let query = {};
				if (this._id) {
					query._id = this._id;
				}
				mongooseQueries.findCreator(query)
				.then((creator) => {
					console.log(creator);
					resolve(creator);
				});
			});
		}
	}
;

module.exports = {
	FragmentResolver,
	CreatorResolver,
};
