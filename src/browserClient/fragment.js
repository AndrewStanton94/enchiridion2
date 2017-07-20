const url = 'http://localhost:3000/fragments';

module.exports = {
	make: (fragmentData) => {
		console.log(fragmentData);
		fetch(url, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(fragmentData),
		})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
		})
		.catch((e) => {
			console.log(e);
		});
	},

	get: (_id) => {
		fetch(`${url}/${_id}`, {
			headers: {
				'Content-Type': 'application/json',
			},
		})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
		})
		.catch((e) => {
			console.log(e);
		});
	},

	search: (query) => {
		fetch(url, {
			method: 'SEARCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(query),
		})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
		})
		.catch((e) => {
			console.log(e);
		});
	},

	update: (_id, fragmentData) => {
		fetch(`${url}/${_id}`, {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(fragmentData),
		})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
		})
		.catch((e) => {
			console.log(e);
		});
	},
};
