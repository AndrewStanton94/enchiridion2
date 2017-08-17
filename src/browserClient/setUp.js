import uiUtils from './uiUtils';
import dataUtils from './dataUtils';
import fragmentPlaceholder from './coreCustomElements/fragmentPlaceholder';
import referenceElement from './coreCustomElements/referenceElement';
import creatorElement from './coreCustomElements/creatorElement';
import fragmentGenerator from './coreCustomElements/fragmentGenerator';
import fragment from './db/fragment.js';
import creator from './db/creator.js';
import pluginLoader from './pluginLoader';
import francis from './francis';

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
		document.enchiridion.francis = francis({
			fragmentLib: fragment,
			creatorLib: creator,
			pluginLoader,
			dataUtils,
		});
		fragmentPlaceholder();
		referenceElement();
		creatorElement();
		fragmentGenerator();
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
			const fragmentGenerator = document.createElement('fragment-generator');
			document.getElementById('content').appendChild(fragmentGenerator);
		}
	},

	loadConfig: () => {
		document.enchiridion = document.enchiridion || {};

		document.enchiridion.config = {
			languages: ['eng', 'pcm', 'gle'],
			formats: ['text/plain'],
			userId: '595e79ffbfcbda4b700867ff',
		};

		document.enchiridion.libs = {
			fragment,
			dataUtils,
			uiUtils,
			pluginLoader,
		};
	},
};
