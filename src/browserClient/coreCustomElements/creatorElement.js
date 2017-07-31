import creator from '../db/creator';

/** Custom element to represent the collection of fragment creators
 */
class creatorElement extends HTMLElement {
	/** Defines the custom element */
	constructor() {
		// Always call super first in constructor
		super();
		const shadow = this.attachShadow({mode: 'open'}),
			profilePicture = document.createElement('img'),
			userName = document.createElement('h1'),
			fullName = document.createElement('h2'),
			bio = document.createElement('div');

		profilePicture.style.borderRadius = '500px';
		profilePicture.style.width = '100%';

		shadow.appendChild(userName);
		shadow.appendChild(profilePicture);
		shadow.appendChild(fullName);
		shadow.appendChild(bio);
	}

	/** Function called when the element is added to screen
	 */
	connectedCallback() {
		this.classList.add('fragment');
	}

	/**
	 * @return {String[]} Custom attributes
	 */
	static get observedAttributes() {
		return ['fragment', 'datatype', 'creator', 'creatorid', 'role'];
	}

	/**
	 * @return {fragmentID}
	 */
	get fragment() {
		return this.getAttribute('fragment');
	}

	/**
	 * @param {fragmentID} fragment
	 */
	set fragment(fragment) {
		if (fragment) {
			this.setAttribute('fragment', fragment);
		} else {
			this.removeAttribute('fragment');
		}
	}

	/**
	 * @return {dataType}
	 */
	get datatype() {
		return JSON.parse(this.getAttribute('dataType'));
	}

	/**
	 * @param {dataType} dataType The data to be displayed
	 */
	set datatype(dataType) {
		if (dataType) {
			this.setAttribute('dataType', JSON.stringify(dataType));
		} else {
			this.removeAttribute('dataType');
		}
	}

	/**
	 * @return {creator}
	 */
	get creator() {
		return JSON.parse(this.getAttribute('creator'));
	}

	/**
	 * @param {creator} creator The data to be displayed
	 */
	set creator(creator) {
		if (creator) {
			this.setAttribute('creator', JSON.stringify(creator));
		} else {
			this.removeAttribute('creator');
		}
	}

	/**
	 * @return {role}
	 */
	get role() {
		return JSON.parse(this.getAttribute('role'));
	}

	/**
	 * @param {role} role The data to be displayed
	 */
	set role(role) {
		if (role) {
			this.setAttribute('role', JSON.stringify(role));
		} else {
			this.removeAttribute('role');
		}
	}

	/**
	 * @return {creatorId}
	 */
	get creatorid() {
		return this.getAttribute('creatorid');
	}

	/**
	 * @param {creatorId} creatorId
	 */
	set creatorid(creatorId) {
		if (creatorId) {
			this.setAttribute('creatorid', creatorId);
		} else {
			this.removeAttribute('creatorid');
		}
	}

	/**
	 * When creatorid is set use it to fetch the creator info
	 * This is saved into the creator attribute
	 */
	loadCreator() {
		creator.get(this.creatorid)
		.then((data) => {
			this.creator = data;
		});
	}

	/**
	 * When the creator is updated, render it
	 */
	renderCreator() {
		const {
				username,
				firstName,
				lastName,
				bio,
				profilePicture,
			} = this.creator,
			fullName = `${firstName} ${lastName}`;

		this.shadowRoot.querySelector('h1').textContent = `@${username}`;

		this.shadowRoot.querySelector('h2').textContent = fullName;

		this.shadowRoot.querySelector('div').textContent = bio;
		this.shadowRoot.querySelector('img').src = profilePicture;
	}

	/**
	 * @param {String} name of the attribute changed
	 * @param {String} oldValue
	 * @param {String} newValue
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		// console.log(name, oldValue, newValue);
		switch (name) {
			case 'creatorid':
				this.loadCreator();
				break;

			case 'creator':
				this.renderCreator();
				break;
			default:
				// console.log('What is this?');
				break;
		}
	}
}

// Define the new element
export default () => {
	customElements.define('creator-element', creatorElement);
};
