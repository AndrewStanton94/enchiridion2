(() => {
	/** Custom element for plaintext content in LTR languages
	 */
	class plainTextLTR extends HTMLElement {
		/** Defines the custom element */
		constructor() {
			// Always call super first in constructor
			super();
			const shadow = this.attachShadow({mode: 'open'}),
				title = document.createElement('h1'),
				select = document.createElement('select'),
				data = document.createElement('div');

			title.textContent = 'This is the title';
			title.contentEditable = true;

			data.innerHTML = '<p>Some text</p><p>Some more text</p>';

			shadow.appendChild(title);
			shadow.appendChild(select);
			shadow.appendChild(data);
		}

		/** Function called when the element is added to screen
		 */
		connectedCallback() {
			this.classList.add('fragment');

			this.addEventListener('input', (e) => {
				if (e.path[0].nodeName === 'H1') {
					this.uploadName();
				} else {
					this.changed = 'local';
					this.uploadData();
				}
				e.stopPropagation();
			});

			this.shadowRoot.querySelector('select').addEventListener('change',
			(e) => {
				console.log(e);
				const pluginData = JSON.parse(e.path[0].value);
				Promise.all([
					document.enchiridion.libs.pluginLoader.run({dataType: pluginData}),
					document.enchiridion.libs.fragment.get(this.fragmentid),
				])
				.then(([{element}, {_id, data}]) => {
					const elem = document.createElement(element);

					elem.fragmentid = _id;
					// Filtering protects against out of date index from UI
					elem.datatype = data.filter(({language, format}, i) => {
						let matchingFormat = format === pluginData.format,
							matchingLanguage = language[0] === pluginData.language[0],
							matches = matchingFormat && matchingLanguage;
						if (matches) {
							elem.index = i;
						}
						return matches;
					})[0];
					elem.fragmentname = this.fragmentname;
					elem.datatypes = this.datatypes;
					this.parentElement.replaceChild(elem, this);
				});
			});
		}

		/**
		 * @return {String[]} Custom attributes
		 */
		static get observedAttributes() {
			return [
				'changed',
				'fragmentid',
				'fragmentname',
				'datatype',
				'datatypes',
				'index',
			];
		}

		/**
		 * @return {Boolean} Element has changed attribute
		 */
		get changed() {
			return this.getAttribute('changed');
		}

		/**
		 * @param {String} val Set or un-set the changed attribute
		 */
		set changed(val) {
			if (val) {
				this.setAttribute('changed', val);
			} else {
				this.removeAttribute('changed');
			}
		}

		/**
		 * @return {fragmentID}
		 */
		get fragmentid() {
			return this.getAttribute('fragmentid');
		}

		/**
		 * @param {fragmentID} fragmentID
		 */
		set fragmentid(fragmentID) {
			if (fragmentID) {
				this.setAttribute('fragmentid', fragmentID);
			} else {
				this.removeAttribute('fragmentid');
			}
		}

		/**
		 * @return {String} fragment title
		 */
		get fragmentname() {
			return this.getAttribute('fragmentname');
		}

		/**
		 * @param {String} fragmentname
		 */
		set fragmentname(fragmentname) {
			if (fragmentname) {
				this.setAttribute('fragmentname', fragmentname);
			} else {
				this.removeAttribute('fragmentname');
			}
		}

		/**
		 * @return {dataType}
		 */
		get datatype() {
			return JSON.parse(this.getAttribute('dataType'));
		}

		/**
		 * @param {dataType} dataType The data to be displayed
		 */
		set datatype(dataType) {
			if (dataType) {
				this.setAttribute('dataType', JSON.stringify(dataType));
			} else {
				this.removeAttribute('dataType');
			}
		}

		/**
		 * @return {dataTypes}
		 */
		get datatypes() {
			return JSON.parse(this.getAttribute('dataTypes'));
		}

		/**
		 * @param {dataType} dataTypes The suitable language, format combinations
		 */
		set datatypes(dataTypes) {
			if (dataTypes) {
				this.setAttribute('dataTypes', JSON.stringify(dataTypes));
			} else {
				this.removeAttribute('dataTypes');
			}
		}

		/**
		 * @return {int} Element has changed attribute
		 */
		get index() {
			return this.getAttribute('index');
		}

		/**
		 * @param {String} val Set or un-set the index attribute
		 */
		set index(val) {
			if (val) {
				this.setAttribute('index', val);
			} else {
				this.removeAttribute('index');
			}
		}

		/**
		 * Updates the displayed fragment name
		 */
		renderName() {
			this.shadowRoot.querySelector('h1').textContent = this.fragmentname;
		}

		/**
		 * Generates the data from the current dataType
		 * Works with text content and nested fragments
		 */
		renderContent() {
			const data = this.shadowRoot.querySelector('div');

			this.lang = this.datatype.language[0];
			data.innerHTML = '';

			this.datatype.data.forEach((dataLine) => {
				let elem;
				switch (typeof dataLine) {
					case 'string':
						elem = document.createElement('div');
						elem.textContent = dataLine !== '' ? dataLine : 'placeholder';
						elem.contentEditable = true;
						break;

					case 'object':
						elem = document.createElement('fragment-placeholder');
						elem.setAttribute('fragment', dataLine.fragment);
						break;

					default:
						console.warn(typeof dataLine);
						break;
				}
				data.appendChild(elem);
			});
		}

		/**
		 * Generates the list of suitable dataTypes
		 */
		renderDataTypes() {
			const select = this.shadowRoot.querySelector('select');
			document.enchiridion.libs.uiUtils.generateOptions(
				this.datatypes.map(({format, language}) => `${format} (${language})`),
				select,
				this.datatypes
			);
			select.selectedIndex = this.index;
		}

		/**
		 * @param {String} name of the attribute changed
		 * @param {String} oldValue
		 * @param {String} newValue
		 */
		attributeChangedCallback(name, oldValue, newValue) {
			switch (name) {
				case 'datatype':
					this.renderContent();
					break;

				case 'fragmentname':
					console.log('name change');
					this.renderName();
					break;

				case 'datatypes':
					this.renderDataTypes();
					break;
			}
		}

		/**
		 * Send changes in the data to the server
		 * Currently re-uploads the full dataType.data[]
		 * This can be refined later
		 */
		uploadData() {
			const currentData = [...this.shadowRoot.querySelector('div').children],
				data = document.enchiridion.libs.dataUtils.elementsToList(currentData);

			let update = {'$set': {'data.$.data': data}};
			document.enchiridion.libs.fragment.updateDataType(this, update)
			.then((fragment) => {
				this.changed = '';
			});
		}

		/**
		 * Send the updated title to the server
		 */
		uploadName() {
			const update = {
				name: this.shadowRoot.querySelector('h1').textContent,
			};
			document.enchiridion.libs.fragment.update(this.fragmentid, update);
		}
	}

	customElements.define('enc-plain_text_ltr', plainTextLTR);
})();
