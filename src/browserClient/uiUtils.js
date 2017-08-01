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

	generateOptions: (list, select) => {
		list.forEach((listItem) => {
			const option = document.createElement('option');
			option.textContent = listItem;
			option.value = listItem;
			select.appendChild(option);
		});
	},
};
