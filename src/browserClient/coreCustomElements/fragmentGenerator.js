import uiUtils from '../uiUtils';
import fragment from '../db/fragment';
import pluginLoader from '../pluginLoader';

/** Custom element to represent a fragment that has not loaded
 */
class fragmentGenerator extends HTMLElement {
	/** Defines the custom element */
	constructor() {
		// Always call super first in constructor
		super();
		const shadow = this.attachShadow({mode: 'open'}),
			title = document.createElement('h1'),
			form = document.createElement('form'),
			language = document.createElement('select'),
			format = document.createElement('select'),
			submit = document.createElement('button');

		title.textContent = 'Gonna make a fragment?';

		language.id = 'language';
		format.id = 'format';

		submit.type = 'submit';
		submit.textContent = 'Generate';

		form.appendChild(language);
		form.appendChild(format);
		form.appendChild(submit);

		shadow.appendChild(title);
		shadow.appendChild(form);
	}

	/** Function called when the element is added to screen
	 */
	connectedCallback() {
		this.classList.add('fragment');
		const form = this.shadowRoot.querySelector('form'),
			languageSelect = form.querySelector('#language'),
			formatSelect = form.querySelector('#format'),
			{
				languages: userLanguages,
				formats: userFormats,
			} = document.enchiridion.config;

		uiUtils.generateOptions(userLanguages, languageSelect);
		uiUtils.generateOptions(userFormats, formatSelect);

		form.addEventListener('submit', (e) => {
			e.preventDefault();
			console.log(languageSelect.value, formatSelect.value);
			const pluginData = {
				'dataType': {
					'format': formatSelect.value,
					'language': languageSelect.value,
				},
			},
			fragmentData = {
				creators: [document.enchiridion.config.userId],
				meta: {
					'sentiment': 'baffled',
				},
				data: [{
					language: languageSelect.value,
					format: formatSelect.value,
					data: ['placeholder'],
				}],
			};

			Promise.all([
				pluginLoader.run(pluginData),
				fragment.make(fragmentData),
			])
			.then(([{element}, {_id, data}]) => {
				const elem = document.createElement(element);

				elem.fragmentid = _id;
				elem.datatype = data[0];
				this.parentElement.replaceChild(elem, this);
			});
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
		// console.log(name, oldValue, newValue);
	}
}

// Define the new element
export default () => {
	customElements.define('fragment-generator', fragmentGenerator);
};
