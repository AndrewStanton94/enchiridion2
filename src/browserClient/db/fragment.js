import common from './common';

const url = 'http://localhost:3000/fragments',
	{headers, resolveJSON} = common;

export default {
	make: (fragmentData) =>
		new Promise(function(resolve, reject) {
			console.log(fragmentData);
			fetch(url, {
				method: 'post',
				headers,
				body: JSON.stringify(fragmentData),
			})
			.then((response) =>
				resolveJSON(response, resolve, reject)
			);
		}),

	get: (_id) =>
		new Promise(function(resolve, reject) {
			fetch(`${url}/${_id}`, {
				headers,
			})
			.then((response) =>
				resolveJSON(response, resolve, reject)
			);
		}),

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

	update: (_id, fragmentData) =>
		new Promise(function(resolve, reject) {
			fetch(`${url}/${_id}`, {
				method: 'put',
				headers,
				body: JSON.stringify(fragmentData),
			})
			.then((response) =>
				resolveJSON(response, resolve, reject)
			);
		}),

	updateDataType: ({fragmentid, datatype}, update) =>
		new Promise(function(resolve, reject) {
			fetch(`${url}/${fragmentid}/${datatype._id}`, {
				method: 'put',
				headers,
				body: JSON.stringify(update),
			})
			.then((response) =>
				resolveJSON(response, resolve, reject)
			);
		})
	,
};
