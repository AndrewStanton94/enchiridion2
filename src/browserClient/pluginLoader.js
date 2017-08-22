import dominatrix from './dominatrix';

export default {
	run: (fragmentInfo) => new Promise(function(resolve, reject) {
		const {
			fragment,
			dataType,
			dataTypes,
		} = fragmentInfo,
		{
			format,
			language,
		} = dataType;

		fetch(`plugins/${format}/${JSON.stringify(language)}`)
		.then((serverResponse) =>
			serverResponse.json()
		)
		.then((serverResponse) => {
			const url = `plugin/${serverResponse.plugin}.js`,
				resolveFunction = () => {
					resolve({
						'element': serverResponse.element,
						'fragment': fragment,
						'dataType': dataType,
						'dataTypes': dataTypes,
					});
				};

			if (dominatrix.scriptInDOM(url)) {
				resolveFunction();
			} else {
				dominatrix.addScript(url, resolveFunction);
			}
		});
	}),
};
