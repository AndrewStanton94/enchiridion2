import common from './common';

/** Custom element to represent a fragment that has not loaded
 */
class fragmentPlaceholder extends common {
	/** Defines the custom element */
	constructor() {
		// Always call super first in constructor
		super();
		const shadow = this.attachShadow({mode: 'open'}),
			title = document.createElement('h1');

		title.textContent = 'Gonna fetch a fragment';
		shadow.appendChild(title);
	}

	/** Function called when the element is added to screen
	 */
	connectedCallback() {
		document.enchiridion.francis.getFragment(this);
	}

	/**
	 * @return {String[]} Custom attributes
	 */
	static get observedAttributes() {
		return ['fragment'];
	}
}

// Define the new element
export default () => {
	customElements.define('fragment-placeholder', fragmentPlaceholder);
};
