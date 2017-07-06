const {buildSchema} = require('graphql');

module.exports = buildSchema(`
	input FragmentData {
		name: String!
		authorId: ID!
		data: String!
	}

	input creatorData {
		name: String!
		languages: [String]
		formats: [String]
	}

	# A unit of information
	type Fragment {
		# Fragment Identifier
		_id: ID!
		# The name of the fragment (optional)
		name: String
		# A list of people who have contributed to the fragment
		creators: [Creator]
		# Returns the data. Extracting dataType happens in the database.
		data: String
		# Stores information about the data
		meta: [String]
		# The change history of an object
		deltas: [String]
		created: String
		changed: String
	}

	type Creator {
		_id: ID!
		name: String
		languages: [String]
		formats: [String]
		created: String
	}

	type Query {
		hello: String
		fragment(_id:ID!, dataType: String): Fragment
		creator(_id:ID!): Creator
	}

	type Mutation {
		createFragment(fragmentData: FragmentData!): Fragment
		createCreator(creatorData: creatorData!): Creator
	}
`);
