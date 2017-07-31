/* eslint-disable no-invalid-this */
const mongoose = require('mongoose'),
	Schema = mongoose.Schema,

	creatorSchema = new Schema(
		{
			username: String,
			firstName: String,
			lastName: String,
			languages: [String],
			formats: [String],
			bio: String,
			profilePicture: String,
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
creatorSchema.pre('save', function(next) {
	const currentDate = new Date();
	this.changed = currentDate;

	if (!this.created) {
		this.created = currentDate;
	}
	next();
});

// make this available to our users in our Node applications
module.exports = {
	Creator: mongoose.model('Creator', creatorSchema),
};
