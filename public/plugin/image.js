(() => {
	const pluginCommon = document.enchiridion.libs.pluginCommon;
	/** Custom element for images
	 */
	class image extends pluginCommon {
		/** Defines the custom element
		*	pluginCommon creates the shadowDom with title and body
		*/
		constructor() {
			// Always call super first in constructor
			super();

			document.enchiridion.libs.dominatrix.styleShadow(
				this,
				`img {
						width: 100%;
						border: 5px solid blue;
				}`
			);
		}

		/** Function called when the element is added to screen
		 * pluginCommon sets up the dataType selector and adds the fragment class
		 */
		connectedCallback() {
			super.connectedCallback();
			const title = this.shadowRoot.querySelector('h1');

			title.addEventListener('input', (e) => {
				this.uploadName();
				e.stopPropagation();
			});
		}

		/**
		 * @return {String[]} Custom attributes
		 */
		static get observedAttributes() {
			return [
				'fragmentid',
				'fragmentname',
				'datatype',
				'datatypes',
				'index',
			];
		}

		/**
		 * @param {String} buttonText
		 * @return {form} addImageForm
		 */
		generateImageForm(buttonText = 'Add an image') {
			const addImageForm = document.createElement('form'),
				imageInput = document.createElement('input'),
				imageButton = document.createElement('button');

			imageInput.type = 'url';
			imageInput.placeholder = 'Full image url';
			imageButton.textContent = buttonText;

			addImageForm.appendChild(imageInput);
			addImageForm.appendChild(imageButton);

			return addImageForm;
		}

		/**
		 * Generates the data from the current dataType
		 * Works with text content and nested fragments
		 */
		renderContent() {
			const addImageForm = this.generateImageForm();

			this.dataElement.innerHTML = '';
			this.datatype.data.forEach((dataLine, i) => {
				let elem;
				switch (typeof dataLine) {
					case 'string':
						elem = document.createElement('img');
						elem.src = dataLine;
						break;

					case 'object':
						elem = document.createElement('fragment-placeholder');
						elem.setAttribute('fragment', dataLine.fragment);
						break;

					default:
						console.warn(typeof dataLine);
						break;
				}
				elem.dataset.imgIndex = i;
				this.dataElement.appendChild(elem);
			});

			// Click a dataList item
			// Currently responds to all elemets including other forms
			this.dataElement.addEventListener('click', (e) => {
				const img = e.path[0],
					editImageForm = this.generateImageForm('Replace image');

				// Only execute this event once per image tags
				let existingInput = `form[data-img-index='${img.dataset.imgIndex}']`;
				if ( img.nodeName !== 'IMG'
					|| this.shadowRoot.querySelector(existingInput) ) {
					return;
				}

				editImageForm.dataset.imgIndex = img.dataset.imgIndex;

				// Image edit
				editImageForm.addEventListener('submit', (e) => {
					e.preventDefault();
					const form = e.path[0],
					imageURL = form.querySelector('input').value,
					patchedData = this.datatype,
					imgIndex = form.dataset.imgIndex;

					if (imageURL.length > 0) {
						patchedData.data.splice(imgIndex, 1, imageURL);
						this.datatype = patchedData;
						let update = {'$set': {'data.$.data': patchedData.data}};
						document.enchiridion.libs.fragment.updateDataType(this, update);
					}
				});
				document.enchiridion.libs.dominatrix.insertAfter(editImageForm, img);
			});

			addImageForm.addEventListener('submit', (e) => {
				e.preventDefault();
				const target = e.path[0],
					imageURL = target.querySelector('input').value,
					patchedData = this.datatype;

				if (imageURL.length > 0) {
					patchedData.data.push(imageURL);
					this.datatype = patchedData;
					let update = {'$set': {'data.$.data': patchedData.data}};
					document.enchiridion.libs.fragment.updateDataType(this, update);
				}
			});

			this.dataElement.appendChild(addImageForm);
		}

		/**
		 * @param {String} name of the attribute changed
		 * @param {String} oldValue
		 * @param {String} newValue
		 */
		attributeChangedCallback(name, oldValue, newValue) {
			console.log(name, newValue);
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

	customElements.define('enc-image', image);
})();
