const url = 'http://localhost:3000/creators';

module.exports = {
	make: (creatorData) =>
		new Promise(function(resolve, reject) {
			fetch(url, {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(creatorData),
			})
			.then((response) => response.json())
			.then((data) => {
				resolve(data);
			})
			.catch((e) => {
				console.log(e);
				reject(e);
			});
		}),

	get: (_id) => {
		return new Promise(function(resolve, reject) {
			fetch(`${url}/${_id}`, {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then((response) => response.json())
			.then((data) => {
				resolve(data);
			})
			.catch((e) => {
				console.log(e);
				reject(e);
			});
		});
	},

	search: (query) =>
		new Promise(function(resolve, reject) {
			fetch(url, {
				method: 'SEARCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(query),
			})
			.then((response) => response.json())
			.then((data) => {
				resolve(data);
			})
			.catch((e) => {
				console.log(e);
				reject(e);
			});
		}),

	update: (_id, creatorData) =>
		new Promise(function(resolve, reject) {
			fetch(`${url}/${_id}`, {
				method: 'put',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(creatorData),
			})
			.then((response) => response.json())
			.then((data) => {
				resolve(data);
			})
			.catch((e) => {
				console.log(e);
				reject(e);
			});
		}),
};
