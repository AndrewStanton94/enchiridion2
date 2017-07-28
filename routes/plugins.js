const express = require('express'),
	router = express.Router(),
	routeHandler = (req, res, next) => {
		console.log(req.params.type);
		console.log(req.params.subtype);
		console.log(req.params.language);
		res.json({
			plugin: 'plainTextLTR',
			element: 'enc-plain_text_ltr',
		});
	};

/* GET users listing. */
router.get('/:type', routeHandler);
router.get('/:type/:subtype', routeHandler);
router.get('/:type/:subtype/:language', routeHandler);

module.exports = router;
