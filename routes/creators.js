const express = require('express'),
	router = express.Router(),
	{Creator} = require('../src/node/db/schemas/creatorSchema');

router.get('/:id', (req, res, next) => {
	const _id = req.params.id;
	Creator.findById(_id).then((creator) => {
		res.json(creator);
	}).catch((err) => {
		console.error(err);
		res.status(404).send('It broke on creator retrieval');
	});
});

router.post('/', (req, res, next) => {
	const creatorData = req.body;
	let newCreator = new Creator(creatorData);

	newCreator.save().then((dbResponse) => {
		res.json(dbResponse);
	}).catch((err) => {
		console.error(err);
		res.status(404).send('It broke on creator creation');
	});
});

router.put('/:id', (req, res, next) => {
	const _id = req.params.id,
		userUpdate = req.body,
		options = {
			new: true,
			runValidators: true,
		}
	;
	Creator.findByIdAndUpdate(
		_id,
		userUpdate,
		options
	).then((creator) => {
		res.json(creator);
	}).catch((err) => {
		console.error(err);
		res.status(404).send('It broke on creator update');
	});
});

router.search('/', (req, res, next) => {
	const searchTerm = req.body;
	Creator.find(searchTerm).then((creators) => {
		res.json(creators);
	}).catch((err) => {
		console.error(err);
		res.status(404).send('It broke on creator retrieval');
	});
});

module.exports = router;
