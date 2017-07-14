/** Used to prototype code based graphql activities
 */
export default function graphql() {
	window.addEventListener('load', (e) => {
		const url = 'http://localhost:3000/graphql',
		query = `
			query frag($_id: ID!, $type: String) {
				fragment(_id: $_id, dataType: $type) {
					_id
					name
					deltas
					data
					creators {
						_id
						name
						languages
						formats
					}
				}

				creator(_id:"595e79ffbfcbda4b700867ff"){
					name
					languages
					formats
				}
			}
		`,

		variables = {
			'_id': '595e9278b80380343cff52ae',
			'type': 'eng',
		};

		fetch(url, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({query, variables}),
		})
		.then((response) => response.json())
		.then((data) => {
			console.log(data.data);
		})
		.catch((e) => {
			console.log(e);
		});
	});
}
