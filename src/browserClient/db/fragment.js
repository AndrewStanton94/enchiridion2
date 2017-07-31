const url = 'http://localhost:3000/fragments';

module.exports = {
	make: (fragmentData) =>
		new Promise(function(resolve, reject) {
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
				resolve(data);
			})
			.catch((e) => {
				console.log(e);
				reject(e);
			});
		}),

	get: (_id) =>
		new Promise(function(resolve, reject) {
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
		}),

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

	update: (_id, fragmentData) =>
		new Promise(function(resolve, reject) {
			fetch(`${url}/${_id}`, {
				method: 'put',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(fragmentData),
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

	updateDataType: ({fragmentid, datatype}, update) =>
		new Promise(function(resolve, reject) {
			fetch(`${url}/${fragmentid}/${datatype._id}`, {
				method: 'put',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(update),
			})
			.then((response) => response.json())
			.then((data) => {
				resolve(data);
			})
			.catch((e) => {
				console.log(e);
				reject(e);
			});
		})
	,
};
