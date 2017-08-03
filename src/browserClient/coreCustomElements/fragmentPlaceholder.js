import dataUtils from '../dataUtils';
import fragment from '../db/fragment';
import pluginLoader from '../pluginLoader';
import common from './common';

/** Custom element to represent a fragment that has not loaded
 */
class fragmentPlaceholder extends common {
	/** Defines the custom element */
	constructor() {
		// Always call super first in constructor
		super();
		const shadow = this.attachShadow({mode: 'open'}),
			title = document.createElement('h1'),
			data = document.createElement('div');

		title.textContent = 'Gonna fetch a fragment';

		data.id = 'data';
		data.innerHTML = `<div class="getFragment">getFragment</div>
			<div class="dataString"></div>
			<div class="chooseDataType">chooseDataType</div>
			<div class="dataTypeString"></div>
			<div class="fetchingPlugin">fetchingPlugin</div>
			<div class="pluginString"></div>`;

		shadow.appendChild(title);
		shadow.appendChild(data);
	}

	/** Function called when the element is added to screen
	 */
	connectedCallback() {
		fragment.get(this.fragment)
		.then((data) => {
			this.updatePlaceholder('dataString', data);
			return data;
		})
		.then((fragment) =>
			new Promise((resolve, reject) => {
				let dataTypes = dataUtils.selectDataType(fragment),
				dataType = dataTypes[0];
				dataTypes = dataTypes.map(({format, language}) => ({format, language}));
				console.log(dataTypes);

				this.updatePlaceholder('dataTypeString', dataType);

				resolve({
					fragment,
					dataType,
					dataTypes,
				});
			})
		).then(pluginLoader.run)
		.then(({
			element,
			dataType,
			dataTypes,
			fragment,
		}) => {
			this.updatePlaceholder('pluginString', element);

			const elem = document.createElement(element),
				referenceElem = document.createElement('reference-element');

			elem.datatype = dataType;
			elem.datatypes = dataTypes;
			elem.fragmentid = fragment._id;
			elem.fragmentname = fragment.name;
			this.parentElement.replaceChild(elem, this);

			referenceElem.fragment = fragment._id;
			referenceElem.datatype = dataType;
			document.getElementById('transclusionData').appendChild(referenceElem);
		});
	}

	/**
	 * @return {String[]} Custom attributes
	 */
	static get observedAttributes() {
		return ['fragment'];
	}


	/**
	 * @param {String} className Class of the element to upade
	 * @param {object} data Data to stringify and display
	 */
	updatePlaceholder(className, data) {
		const element = this.shadowRoot.getElementById('data')
			.getElementsByClassName(className)[0];

		element.textContent = JSON.stringify(data);
	}
}

// Define the new element
export default () => {
	customElements.define('fragment-placeholder', fragmentPlaceholder);
};
