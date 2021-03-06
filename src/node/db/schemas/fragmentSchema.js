/* eslint-disable no-invalid-this */
const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	{dataTypeSchema} = require('./dataTypeSchema'),

// create a schema
	fragmentSchema = new Schema(
		{
			name: String,
			data: [dataTypeSchema],
			meta: Schema.Types.Mixed,
			deltas: [String],
			creators: [String],
		},
		{
			timestamps: {
				createdAt: 'created',
				updatedAt: 'changed',
			},
			emitIndexErrors: true,
			minimize: false,
		}
	);

// on every save, add the date
fragmentSchema.pre('save', function(next) {
	const currentDate = new Date();
	this.changed = currentDate;

	if (!this.created) {
		this.created = currentDate;
	}
	next();
});

// make this available to our users in our Node applications
module.exports = {
	Fragment: mongoose.model('Fragment', fragmentSchema),
};
