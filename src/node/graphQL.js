const express = require('express'),
	router = express.Router(),
	graphqlHTTP = require('express-graphql'),
	mongoose = require('mongoose'),
	// What things exist and what can be requested
	schema = require('./graphQLschema'),
	mongooseQueries = require('./mongooseQueries'),

	// Functions to handle the requests
	rootValue = {
		hello: () => 'Hello world!',
		fragment: ({_id, dataType}) =>
			new Promise((resolve, reject) => {
				let query = {};
				if (_id) {
					query._id = _id;
				}
				mongooseQueries.findFragment(query).then((input) => input[0])
				.then((fragment) => {
					console.log(fragment);
					fragment.data = JSON.stringify(fragment.data);
					resolve(fragment);
				});
			}),

		creator: ({_id}) =>
			new Promise((resolve, reject) => {
				console.log('Resolving a creator');
				let query = {};
				if (_id) {
					query._id = _id;
				}
				mongooseQueries.findCreator(query).then((input) => input[0])
				.then((fragment) => {
					console.log(fragment);
					resolve(fragment);
				});
			}),

		createCreator: ({creatorData}) =>
			new Promise((resolve, reject) => {
				mongooseQueries.createCreator({
					'name': creatorData.name,
					'languages': creatorData.languages,
					'formats': creatorData.formats,
				}).then((input) => {
					console.log('createCreator then:');
					console.log(input);
					resolve(input);
				}).catch((err) => {
					throw err;
				});
			}),

		createFragment: ({fragmentData}) =>
			new Promise((resolve, reject) => {
				mongooseQueries.createFragment({
					'name': fragmentData.name,
					'data': fragmentData.data,
					'creators': [fragmentData.authorId],
				}).then((input) => {
					console.log('createFragment then:');
					console.log(input);
					resolve(input);
				}).catch((err) => {
					throw err;
				});
			}),
	}
;

router.use('/', graphqlHTTP({
	schema,
	rootValue,
	graphiql: true,
}));

mongoose.connect('mongodb://localhost/test', {
	useMongoClient: true,
});

module.exports = router;
