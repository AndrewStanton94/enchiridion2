export default {
	toggleVisisbility: (e) => {
		console.log(e.target);
		const toggleElem = e.target,
			{elemid, hidden, visible} = toggleElem.dataset,
			panel = document.getElementById(elemid);

		if (panel.classList.contains('hidden')) {
			panel.classList.remove('hidden');
			toggleElem.textContent = visible;
		} else {
			panel.classList.add('hidden');
			toggleElem.textContent = hidden;
		}
	},
};
