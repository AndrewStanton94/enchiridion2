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
				existingScripts = document.querySelectorAll(`script[src="${url}"]`);

			// Only load plugin if not already loaded
			if (existingScripts.length === 0) {
				const scriptTag = document.createElement('script');
				scriptTag.src = url;

				scriptTag.addEventListener('load', () => {
					resolve({
						'element': serverResponse.element,
						'fragment': fragment,
						'dataType': dataType,
					});
				});
				document.getElementsByTagName('head')[0].appendChild(scriptTag);
			} else {
				resolve({
					'element': serverResponse.element,
					'fragment': fragment,
					'dataType': dataType,
				});
			}
		});
	}),
};
