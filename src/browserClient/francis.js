import dominatrix from './dominatrix';

export default ({
	fragmentLib, creatorLib, pluginLoader, dataUtils, uiUtils,
}) => ({
	// libs: {fragmentLib, creatorLib, pluginLoader, dataUtils},

	getFragment: (existingElement) => {
		fragmentLib.get(existingElement.fragment)
		.then((fragment) =>
			new Promise((resolve, reject) => {
				let dataTypes = dataUtils.selectDataType(fragment),
				dataType = dataTypes[0];
				dataTypes = dataUtils.extractFormatAndLanguage(dataTypes);

				resolve({
					fragment,
					dataType,
					dataTypes,
					existingElement,
				});
			})
		)
		.then(document.enchiridion.francis.getAndUsePlugin);
	},

	makeFragment: ({
		existingElement,
		pluginData,
	}) => {
		const {format, language} = pluginData.dataType,
			fragmentData = {
			data: [{
				language,
				format,
				data: ['placeholder'],
				creators: [document.enchiridion.config.userId],
			}],
		};

		fragmentLib.make(fragmentData)
		.then(({_id, data}) => {
			console.log(existingElement);
			document.enchiridion.francis.getAndUsePlugin({
				existingElement,
				fragment: {_id},
				dataType: data[0],
				dataTypes: data,
			});
		});
	},

	addNewDataType: ({
		existingElement,
		pluginData,
	}) => {
		const {format, language} = pluginData.dataType,
			fragmentData = {
				language,
				format,
				data: ['placeholder'],
				creators: [document.enchiridion.config.userId],
			},
			update = {
				$push: {data: fragmentData},
			};

		fragmentLib.update(existingElement.fragment, update)
		.then(({_id, data}) => {
			document.enchiridion.francis.getAndUsePlugin({
				existingElement,
				fragment: {
					_id,
					name: existingElement.fragmentname,
				},
				dataType: data[data.length - 1],
				dataTypes: dataUtils.extractFormatAndLanguage(data),
			});
		});
	},

	getAndUsePlugin: ({
		existingElement,
		fragment,
		dataType,
		dataTypes,
		postRender,
	}) =>
		pluginLoader.run({fragment, dataType, dataTypes})
		.then(({
			element,
			dataType,
			dataTypes,
			fragment,
		}) => {
			const elem = document.createElement(element);

			elem.datatype = dataType;
			elem.datatypes = dataTypes;
			elem.fragmentid = fragment._id;
			elem.fragmentname = fragment.name;
			dominatrix.replaceElementWith(existingElement, elem);
			if (postRender) {
				return {postRender, elem};
			}
		}),

	/*
	 * Generate a form that allows the user to select the dataType to view
	 * The form is return so it can be inserted by the plugin
	 * There is also a button to create a new dataType
	 */
	generateDataTypeSelector: (existingElement) => {
		const form = document.createElement('form'),
			select = document.createElement('select'),
			button = document.createElement('button');

		button.textContent = 'NEW DATATYPE';

		select.addEventListener('change', (e) => {
			console.log(e);
			const pluginData = JSON.parse(e.path[0].value);

			fragmentLib.get(existingElement.fragmentid)
			.then((fragment) =>
				new Promise((resolve, reject) => {
					let index,
						getDataType = ({language, format}, i) => {
							let matchingFormat = format === pluginData.format,
								matchingLanguage = language[0] === pluginData.language[0],
								matches = matchingFormat && matchingLanguage;
								if (matches) {
									index = i;
								}
							return matches;
						},
						dataType = fragment.data.filter(getDataType)[0],
						dataTypes = dataUtils.extractFormatAndLanguage(fragment.data);

					resolve({
						fragment,
						dataType,
						dataTypes,
						postRender: {dataTypeSelectIndex: index},
						existingElement,
					});
				})
			)
			.then(document.enchiridion.francis.getAndUsePlugin)
			.then(({postRender, elem}) => {
				if (postRender.dataTypeSelectIndex) {
					const select = elem.shadowRoot.querySelector('select');
					select.selectedIndex = postRender.dataTypeSelectIndex;
				}
			});
		});

		button.addEventListener('click', (e) => {
			const fragmentGenerator = document.createElement('fragment-generator');

			fragmentGenerator.fragment = existingElement.fragmentid;
			fragmentGenerator.datatypes = existingElement.datatypes;
			fragmentGenerator.fragmentname = existingElement.fragmentname;
			dominatrix.replaceElementWith(existingElement, fragmentGenerator);
		});

		form.appendChild(select);
		form.appendChild(button);

		return form;
	},

	/**
	 * Generates the list of suitable dataTypes
	 * @param {existing} existingElement The custom element to be updated
	 */
	renderDataTypes: (existingElement) => {
		const select = existingElement.shadowRoot.querySelector('select');
		if (select === null) {
			return;
		}

		let dataTypes = existingElement.datatypes;
		uiUtils.generateOptions(
			dataTypes.map(({format, language}) => `${format} (${language})`),
			select,
			existingElement.datatypes
		);
		select.selectedIndex = existingElement.index;
	},
});
