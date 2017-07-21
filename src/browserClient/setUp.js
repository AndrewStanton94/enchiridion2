import uiUtils from './uiUtils';

export default {
	addEventListeners: () => {
		const toggles = [...document.getElementsByClassName('toggle')];
		toggles.forEach((elem) => {
			elem.addEventListener('click', uiUtils.toggleVisisbility);
		});
	},
};
