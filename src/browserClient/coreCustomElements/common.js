/** Custom element to represent a fragment that has not loaded
 */
export default class extends HTMLElement {
	/** Defines the custom element */
	constructor() {
		// Always call super first in constructor
		super();
	}

	/**
	 * @return {String[]} Custom attributes
	 */
	static get observedAttributes() {
		return ['fragment', 'datatypes'];
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
			this.setAttribute('fragment', val);
		} else {
			this.removeAttribute('fragment');
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
	 * @param {String} name of the attribute changed
	 * @param {String} oldValue
	 * @param {String} newValue
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		console.log(name, oldValue, newValue);
	}
}
