import setUp from './setUp';

window.addEventListener('load', () => {
	setUp.loadConfig();
	setUp.defineCoreCustomElements();
	setUp.addEventListeners();
	setUp.loadFragmentFromURL();
});
