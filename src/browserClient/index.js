import setUp from './setUp';

window.addEventListener('load', () => {
	setUp.loadConfig();
	setUp.definePlaceholder();
	setUp.addEventListeners();
	setUp.loadFragmentFromURL();
});
