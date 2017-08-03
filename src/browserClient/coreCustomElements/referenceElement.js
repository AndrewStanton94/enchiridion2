import common from './common';

/** Custom element to represent the collection of fragment creators
 */
class referenceElement extends common {
	/** Defines the custom element */
	constructor() {
		// Always call super first in constructor
		super();
		this.attachShadow({mode: 'open'});
	}

	/** Function called when the element is added to screen
	 */
	connectedCallback() {
		this.classList.add('fragment');
	}

	/**
	 * @return {String[]} Custom attributes
	 */
	static get observedAttributes() {
		return ['fragment', 'datatype'];
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
	 * Uses the creator ids from the dataType to generate creator elements
	 */
	generateCreators() {
		this.datatype.creators.forEach((creator) => {
			const elem = document.createElement('creator-element');
			elem.creatorid = creator;
			this.shadowRoot.appendChild(elem);
		});
	}

	/**
	 * @param {String} name of the attribute changed
	 * @param {String} oldValue
	 * @param {String} newValue
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		// console.log(name, oldValue, newValue);
		switch (name) {
			case 'datatype':
				this.generateCreators();
				break;
			default:
				break;
		}
	}
}

// Define the new element
export default () => {
	customElements.define('reference-element', referenceElement);
};
