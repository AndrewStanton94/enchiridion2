import uiUtils from '../uiUtils';
import common from './common';

/** Custom element to represent a fragment that has not loaded
 */
class fragmentGenerator extends common {
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
	 *  Generate form with the users languages and formats
	 *  If there is a fragment value it will add the new format
	 *  Else it will create a new fragment.
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

			if (this.fragment) {
				console.log('dataType');
				this.createDataType(languageSelect, formatSelect);
			} else {
				console.log('fragment');
				this.createFragment(languageSelect, formatSelect);
			}
		});
	}

	/**
	 * @param {String} languageSelect
	 * @param {String} formatSelect
	 * Generate a new fragment using the language and format from the UI
	 */
	createFragment(languageSelect, formatSelect) {
		console.log(languageSelect.value, formatSelect.value);
		const pluginData = {
			'dataType': {
				'format': formatSelect.value,
				'language': languageSelect.value,
			},
		};

		document.enchiridion.francis.makeFragment({
			existingElement: this,
			pluginData,
		});
	}

	/**
	 * @param {String} languageSelect
	 * @param {String} formatSelect
	 * Generate a new dataType using the language and format from the UI
	 * Checks the existing datatypes to provent duplications.
	 * TODO: Give user feedback on duplicate choice.
	 */
	createDataType(languageSelect, formatSelect) {
		const selectedLanguage = languageSelect.value,
			selectedFormat = formatSelect.value,
			pluginData = {
				'dataType': {
					'format': selectedFormat,
					'language': selectedLanguage,
				},
			},

			sameLanguage = this.datatypes.filter(({language}) => {
				let sameLang = language[0] === selectedLanguage;
				return sameLang;
			}),
			sameFormat = sameLanguage.filter(({format}) => {
				let sameFmt = format === selectedFormat;
				return sameFmt;
			});


		if (sameFormat.length > 0) {
			console.warn('This dataType already exists');
			return;
		}

		document.enchiridion.francis.addNewDataType({
			existingElement: this,
			pluginData,
		});
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
	 * @return {String[]} Custom attributes
	 */
	static get observedAttributes() {
		return [
			'fragmentname',
			'fragment',
			'datatypes',
		];
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
}

// Define the new element
export default () => {
	customElements.define('fragment-generator', fragmentGenerator);
};
