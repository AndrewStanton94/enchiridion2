const express = require('express'),
	router = express.Router(),
	graphqlHTTP = require('express-graphql'),
	mongoose = require('mongoose'),
	// What things exist and what can be requested
	schema = require('./graphQLschema'),
	{
		FragmentResolver,
		CreatorResolver,
	} = require('./resolverClasses'),

	// Functions to handle the requests
	rootValue = {
		hello: () => 'Hello world!',

		fragment: ({_id, dataType}) =>
			new FragmentResolver(_id, dataType),

		creator: ({_id}) =>
			new CreatorResolver(_id).getCreator(),

		createCreator: ({creatorData}) =>
			new CreatorResolver().make(creatorData),

		createFragment: ({fragmentData}) =>
			new FragmentResolver().make(),
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
