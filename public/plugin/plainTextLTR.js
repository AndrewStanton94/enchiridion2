(() => {
	const pluginCommon = document.enchiridion.libs.pluginCommon;
	/** Custom element for plaintext content in LTR languages
	 */
	class plainTextLTR extends pluginCommon {
		/** Defines the custom element */
		constructor() {
			// Always call super first in constructor
			super();
		}

		/** Function called when the element is added to screen
		 */
		connectedCallback() {
			super.connectedCallback();
			this.addEventListener('input', (e) => {
				if (e.path[0].nodeName === 'H1') {
					this.uploadName();
				} else {
					this.changed = 'local';
					this.uploadData();
				}
				e.stopPropagation();
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

				case 'datatypes':
					document.enchiridion.francis.renderDataTypes(this);
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
	}

	customElements.define('enc-plain_text_ltr', plainTextLTR);
})();
