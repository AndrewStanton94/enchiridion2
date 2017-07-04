const {buildSchema} = require('graphql');

module.exports = buildSchema(`
	input FragmentData {
		name: String!
		authorId: ID!
	}

	# A unit of information
	type Fragment {
		# Fragment Identifier
		id: ID!
		# The name of the fragment (optional)
		name: String
		# A list of people who have contributed to the fragment
		creators: [Creator]
		# Returns the data from a single dataType.\
		Extracting this information will happen in the database / resolver
		data: [String]
		# The change history of an object
		deltas: [String]
	}

	type Creator {
		id: ID!
		name: String
	}

	type Query {
		hello: String
		fragment(id:ID!, dataType: String): Fragment
		creator: Creator
	}

	type Mutation {
		createFragment(fragmentData: FragmentData!): Fragment
	}
`);
