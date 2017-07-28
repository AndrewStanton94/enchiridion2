export default {
	run: (fragmentInfo) => new Promise(function(resolve, reject) {
		const {
			fragment,
			dataType,
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
				scriptTag = document.createElement('script');
			scriptTag.src = url;

			scriptTag.addEventListener('load', () => {
				resolve({
					'element': serverResponse.element,
					'fragment': fragment,
					'dataType': dataType,
				});
			});
			document.getElementsByTagName('head')[0].appendChild(scriptTag);
		});
	}),
};
