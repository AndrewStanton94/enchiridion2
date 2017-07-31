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
				data = document.createElement('div');

			title.textContent = 'This is the title';

			data.innerHTML = '<p>Some text</p><p>Some more text</p>';
			data.contentEditable = true;

			shadow.appendChild(title);
			shadow.appendChild(data);
		}

		/** Function called when the element is added to screen
		 */
		connectedCallback() {
			console.log('On screen yo');
			this.classList.add('fragment');

			this.addEventListener('input', (e) => {
				this.changed = 'local';
				this.upload();
				e.stopPropagation();
			});
		}

		/**
		 * @return {String[]} Custom attributes
		 */
		static get observedAttributes() {
			return ['changed', 'fragmentid', 'fragmentname', 'datatype'];
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
						elem.textContent = dataLine;
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
					this.renderName();
					break;
			}
		}

		/**
		 * Send changes in the data to the server
		 * Currently re-uploads the full dataType.data[]
		 * This can be refined later
		 */
		upload() {
			const currentData = [...this.shadowRoot.querySelector('div').children],
				savedData = this.datatype.data,
				dLength = currentData.length - savedData.length;

			if (dLength === 0) {
				let changes = {};
				console.log('Change within elements');
				for (let i = 0; i < currentData.length; i++) {
					const elem = currentData[i].textContent,
						same = savedData[i] === elem;
					if (!same) {
						changes[i] = elem;
					}
				}
			} else {
				if (dLength > 0) {
					console.log('Added elements');
				} else if (dLength < 0) {
					console.log('elements deleted');
				}
			}

			let newData = currentData.map((elem, i) => {
				console.log(elem);
				if (elem.classList.contains('fragment')) {
					return savedData[i];
				}
				return elem.textContent;
			}),
			update = {'$set': {'data.$.data': newData}};

			document.enchiridion.libs.fragment.updateDataType(this, update)
			.then((fragment) => {
				this.changed = '';
			});
		}
	}

	customElements.define('enc-plain_text_ltr', plainTextLTR);
})();