module.exports = {
	creator: {
		newUserData: {
			firstName: 'Ghastly',
			lastName: 'Bespoke',
			username: 'G-Bes',
			languages: ['eng', 'gle'],
			formats: ['txt', 'png', 'svg'],
		},

		searchTerm: {
			firstName: 'Ghastly',
		},

		userUpdate: {
			username: 'Gas-Bes',
			formats: ['txt', 'png', 'svg', 'tml', 'ecf'],
		},

		_id: '596f7c2d76dd99074469c9ef',
	},

	fragment: {
		_id: '596fe8cd0d9c993b48dbf3ad',

		newFragmentData: {
			name: 'Another fragment',
			creators: ['596f7c2d76dd99074469c9ef'],
			meta: {
				'sentiment': 'baffled',
			},
			data: [{
				language: 'eng',
				format: 'text/plain',
				data: ['iwtenp', ':D'],
			}, {
				language: 'gle',
				format: 'text/plain',
				data: ['fkdlsajfldkj'],
			}],
		},

		searchTerm: {
			'data.language': {$in: ['eng']},
			'data.format': {$eq: 'text/plain'},
			// Mongo doesn't understand $text
			// Have to regex it but can't stringify it
			// 'data.data': {$regex: /the/},
		},

		fragmentUpdate: {
			'data': [{
				'format': 'text/plain',
				'_id': '596fe8cd0d9c993b48dbf3ae',
				'data': [
					'iwtenp',
					':D',
					'bwhbgaawnc',
					'ratwabf',
					'ggbtclobbtbg',
				],
				'language': [
					'eng',
					'pcm',
				],
			}],
		},
	},
};
