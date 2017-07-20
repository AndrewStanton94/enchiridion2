const express = require('express'),
	router = express.Router(),
	{Fragment} = require('../src/node/db/schemas/fragmentSchema');

router.get('/:id', (req, res, next) => {
	const _id = req.params.id;
	Fragment.findById(_id).then((fragment) => {
		res.json(fragment);
	}).catch((err) => {
		console.error(err);
		res.status(404).send('It broke on fragment retrieval');
	});
});

router.post('/', (req, res, next) => {
	const fragmentData = req.body;
	let newFragment = new Fragment(fragmentData);
	newFragment.save().then((dbResponse) => {
		res.json(dbResponse);
	}).catch((err) => {
		console.error(err);
		res.status(404).send('It broke on fragment creation');
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
	Fragment.findByIdAndUpdate(
		_id,
		userUpdate,
		options
	).then((fragment) => {
		res.json(fragment);
	}).catch((err) => {
		console.error(err);
		res.status(404).send('It broke on fragment update');
	});
});

router.search('/', (req, res, next) => {
	const searchTerm = req.body;
	Fragment.find(searchTerm).then((fragments) => {
		res.json(fragments);
	}).catch((err) => {
		console.error(err);
		res.status(404).send('It broke on fragment retrieval');
	});
});

module.exports = router;
