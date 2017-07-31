/* eslint-disable no-invalid-this */
const mongoose = require('mongoose'),
	Schema = mongoose.Schema,

// create a schema
	dataTypeSchema = new Schema(
		{
			language: [String],
			format: String,
			data: {
				type: [Schema.Types.Mixed],
				index: true,
			},
			meta: Schema.Types.Mixed,
			creators: [String],
		},
		{
			emitIndexErrors: true,
			minimize: false,
		}
	);

// make this available to our users in our Node applications
module.exports = {
	DataType: mongoose.model('DataType', dataTypeSchema),
	dataTypeSchema,
};
