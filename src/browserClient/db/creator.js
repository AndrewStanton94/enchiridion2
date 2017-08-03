import common from './common';

const url = 'http://localhost:3000/creators',
	{headers, resolveJSON} = common;

export default {
	make: (creatorData) =>
		new Promise(function(resolve, reject) {
			fetch(url, {
				method: 'post',
				headers,
				body: JSON.stringify(creatorData),
			})
			.then((response) =>
				resolveJSON(response, resolve, reject)
			);
		}),

	get: (_id) => {
		return new Promise(function(resolve, reject) {
			fetch(`${url}/${_id}`, {
				headers,
			})
			.then((response) =>
				resolveJSON(response, resolve, reject)
			);
		});
	},

	search: (query) =>
		new Promise(function(resolve, reject) {
			fetch(url, {
				method: 'SEARCH',
				headers,
				body: JSON.stringify(query),
			})
			.then((response) =>
				resolveJSON(response, resolve, reject)
			);
		}),

	update: (_id, creatorData) =>
		new Promise(function(resolve, reject) {
			fetch(`${url}/${_id}`, {
				method: 'put',
				headers,
				body: JSON.stringify(creatorData),
			})
			.then((response) =>
				resolveJSON(response, resolve, reject)
			);
		}),
};
