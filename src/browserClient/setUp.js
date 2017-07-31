import uiUtils from './uiUtils';
import dataUtils from './dataUtils';
import fragmentPlaceholder from './coreCustomElements/fragmentPlaceholder';
import referenceElement from './coreCustomElements/referenceElement';
import creatorElement from './coreCustomElements/creatorElement';
import fragment from './db/fragment.js';

export default {
	addEventListeners: () => {
			const toggles = [...document.getElementsByClassName('toggle')],
			content = document.getElementById('content');

		// Buttons to Toggle side panel visibilty
		toggles.forEach((elem) => {
			elem.addEventListener('click', uiUtils.toggleVisisbility);
		});

		/**
		 * Event to add fragment placeholder to content
		 *
		 * Fragment id passed as fragment attribute on the element
		 * @param {e.detail} fragment The id of the fragment
		 * @listens generatePlaceholder
		 */
		content.addEventListener('generatePlaceholder', (e) => {
			const placeholder = document.createElement('fragment-placeholder');
			placeholder.setAttribute('fragment', e.detail.fragment);
			content.appendChild(placeholder);
		});
	},

	defineCoreCustomElements: () => {
		fragmentPlaceholder();
		referenceElement();
		creatorElement();
	},

	/**
	 * Check the url for fragment to load and retrieve
	 */
	loadFragmentFromURL: () => {
		let params = dataUtils.getParamsFromURL();
		if (Object.keys(params).includes('fragment')) {
			const data = {
				detail: params,
			},
			event = new CustomEvent('generatePlaceholder', data);
			document.getElementById('content').dispatchEvent(event);
		} else {
			alert('No fragment given');
		}
	},

	loadConfig: () => {
		document.enchiridion = document.enchiridion || {};

		document.enchiridion.config = {
			languages: ['eng', 'pcm', 'gle'],
			formats: ['text/plain'],
		};

		document.enchiridion.libs = {
			fragment,
		};
	},
};
