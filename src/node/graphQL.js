const express = require('express'),
	router = express.Router(),
	graphqlHTTP = require('express-graphql'),
	mongoose = require('mongoose'),
	// What things exist and what can be requested
	schema = require('./graphQLschema'),
	mongooseQueries = require('./mongooseQueries'),
	{
		FragmentResolver,
		CreatorResolver,
	} = require('./resolverClasses'),

	// Functions to handle the requests
	rootValue = {
		hello: () => 'Hello world!',

		fragment: ({_id, dataType}) => new FragmentResolver(_id, dataType),

		creator: ({_id}) => new CreatorResolver(_id),

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

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test', {
	useMongoClient: true,
});

module.exports = router;
