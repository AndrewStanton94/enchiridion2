import dataUtils from './dataUtils';
import fragment from './fragment';
import pluginLoader from './pluginLoader';

/** Custom element to represent a fragment that has not loaded
 */
class fragmentPlaceholder extends HTMLElement {
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
				const dataType = dataUtils.selectDataType(fragment);

				this.updatePlaceholder('dataTypeString', dataType);

				resolve({
					fragment,
					dataType,
				});
			})
		).then(pluginLoader.run)
		.then(({
			element,
			dataType,
			fragment,
		}) => {
			this.updatePlaceholder('pluginString', element);

			const elem = document.createElement(element);

			elem.datatype = dataType;
			elem.fragmentid = fragment._id;
			elem.fragmentname = fragment.name;

			this.parentElement.replaceChild(elem, this);
		});
	}

	/**
	 * @return {String[]} Custom attributes
	 */
	static get observedAttributes() {
		return ['fragment'];
	}

	/**
	 * @return {fragmentID}
	 */
	get fragment() {
		return this.getAttribute('fragment');
	}

	/**
	 * @param {fragmentID} val
	 */
	set fragment(val) {
		if (val) {
			this.setAttribute('fragment', '');
		} else {
			this.removeAttribute('fragment');
		}
	}

	/**
	 * @param {String} name of the attribute changed
	 * @param {String} oldValue
	 * @param {String} newValue
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		console.log(name, oldValue, newValue);
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
