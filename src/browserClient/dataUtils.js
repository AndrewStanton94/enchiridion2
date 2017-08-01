const
	/**
	 * @param {String} urlString param string
	 * @return {Object} Key value pairs of arguments from URL
	 */
	getParamsFromURL= (urlString = window.location.search) => {
		const urlParams = {};
		// Remove preceeding ? character
		urlString = urlString.slice(1);
		let args = urlString.split('&');
		args.forEach((arg) => {
			let components = arg.split('=');
			urlParams[components[0]] = components[1];
		});
		return urlParams;
	},

	/** @param {dataType} dataType The datatype being inspected
	 *  @param {String} listName the array property to check
	 *  @param {String[]} configList The values accepted
	 *  @return {boolean} User knows at least one language in the dataType
	 */
	dataTypeMatchesConfig = (dataType, listName, configList) =>
		dataType[listName].some((lang) =>
			configList.includes(lang)
		),

	selectDataType = (fragment, config = document.enchiridion.config) => {
		const dataLang = fragment.data.filter((dataType) =>
			dataTypeMatchesConfig(
				dataType,
				'language',
				config.languages
			)
		);
		let dataFormat;

		switch (dataLang.length) {
			case 0:
				console.warn('No matching languages');
				break;
			case 1:
				console.log('One matching language');
				dataFormat = dataLang;
				break;
			default:
				dataFormat = dataLang.filter((dataType) =>
					config.formats.includes(dataType.format)
				);
				switch (dataFormat.length) {
					case 0:
						console.warn('No formats match, default first matching language');
						dataFormat = dataLang;
						break;
					case 1:
						console.log('Single matching format');
						break;
					default:
						console.log('Many lang many formats');
						break;
				}
		}
		return dataFormat[0];
	},

	extractContent = (elem) => {
		const fragment = elem.fragmentid;
		console.log(fragment);
		let returnValue;
		if (fragment) {
			returnValue = {
				type: 'transclusion',
				fragment: elem.fragmentid,
			};
		} else {
			returnValue = elem.textContent;
		}
		console.log(returnValue);
		return returnValue;
	},

	elementsToList = (list) => list.map(extractContent)
;

export default {
	getParamsFromURL,
	dataTypeMatchesConfig,
	selectDataType,
	elementsToList,
};
