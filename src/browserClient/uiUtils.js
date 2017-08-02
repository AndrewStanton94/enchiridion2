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

	/**
	 * @param {String} list The content to display
	 * @param {element} select The element being populated
	 * @param {String} value Use this list to set value attribute if it exsits
	 */
	generateOptions: (list, select, value) => {
		list.forEach((listItem, i) => {
			const option = document.createElement('option');
			option.textContent = listItem;
			option.value = value ? JSON.stringify(value[i]) : listItem;
			select.appendChild(option);
		});
	},
};
