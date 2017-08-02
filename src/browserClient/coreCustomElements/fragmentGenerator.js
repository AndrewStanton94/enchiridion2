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
				creators: [document.enchiridion.config.userId],
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
			fragmentData = {
				language: selectedLanguage,
				format: selectedFormat,
				data: ['placeholder'],
				creators: [document.enchiridion.config.userId],
			},
			update = {
				$push: {data: fragmentData},
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

		Promise.all([
			pluginLoader.run(pluginData),
			fragment.update(this.fragment, update),
		])
		.then(([{element}, {_id, data}]) => {
			console.log(data);
			const elem = document.createElement(element);

			elem.fragmentid = _id;
			elem.datatype = data[data.length - 1];
			elem.datatypes = data.map(({format, language}) => ({format, language}));
			this.parentElement.replaceChild(elem, this);
		});
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

// Define the new element
export default () => {
	customElements.define('fragment-generator', fragmentGenerator);
};
