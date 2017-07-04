const express = require('express'),
	router = express.Router(),
	graphqlHTTP = require('express-graphql'),
	// What things exist and what can be requested
	schema = require('./graphQLschema'),

	// Functions to handle the requests
	rootValue = {
		hello: () => 'Hello world!',
		fragment: ({id, dataType}) => {
			let getData = (dataType) => {
				console.log('Calling data');
				return JSON.parse('{"eng":["wibble"],"pcm":["howfa"]}')[dataType];
			};
			return {
				'id': id,
				'name': 'Wibble',
				'creators': [{
					'id': '10',
					'name': 'Edmund',
				}],
				'data': getData(dataType),
			};
		},
		creator: () => {
			return {
				'id': '10',
				'name': 'Edmund',
			};
		},
		createFragment: ({fragmentData}) => {
			console.log(fragmentData);
			return {
				'name': fragmentData.name,
				'id': '6969',
				'creator': fragmentData.authorId,
			};
		},
	}
;

router.use('/', graphqlHTTP({
	schema,
	rootValue,
	graphiql: true,
}));

module.exports = router;
