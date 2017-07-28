import creator from './creator';
import fragment from './fragment';
import testData from './testData';

// creator.get(testData.creator._id);
// creator.make(testData.creator.newUserData);
creator.search(testData.creator.searchTerm);
// creator.update(testData.creator._id, testData.creator.userUpdate);

// fragment.get(testData.fragment._id);
// fragment.make(testData.fragment.newFragmentData);
fragment.search(testData.fragment.searchTerm);
// fragment.update(testData.fragment._id, testData.fragment.fragmentUpdate);

import setUp from './setUp';

window.addEventListener('load', () => {
	setUp.loadConfig();
	setUp.definePlaceholder();
	setUp.addEventListeners();
	setUp.loadFragmentFromURL();
});
