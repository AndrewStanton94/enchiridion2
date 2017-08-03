export default {
	headers: {
		'Content-Type': 'application/json',
	},

	resolveJSON: (response, resolve, reject) =>
		response.json()
		.then((data) => {
			resolve(data);
		})
		.catch((e) => {
			console.log(e);
			reject(e);
		}),
};
