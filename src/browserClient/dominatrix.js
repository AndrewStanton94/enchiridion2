export default {
    scriptInDOM: (url) => {
		const existingScripts = document.querySelectorAll(`script[src="${url}"]`);
        return existingScripts.length > 0;
    },

    addScript: (url, loadEvent) => {
		const scriptTag = document.createElement('script');
		scriptTag.src = url;

        if (loadEvent) {
            scriptTag.addEventListener('load', loadEvent);
        }

		document.getElementsByTagName('head')[0].appendChild(scriptTag);
    },

    addStyle: (url, loadEvent) => {
		const style = document.createElement('link');
		style.href = url;
		style.rel = 'stylesheet';

        if (loadEvent) {
            style.addEventListener('load', loadEvent);
        }

		document.getElementsByTagName('head')[0].appendChild(style);
    },

    replaceElementWith: (existingElement, newElement) => {
        existingElement.parentElement.replaceChild(newElement, existingElement);
    },

    styleShadow: (existingElement, styleString) => {
        const styleElem = document.createElement('style');

        styleElem.innerHTML = styleString;
        existingElement.shadowRoot.appendChild(styleElem);
    },

    insertAfter: (newElement, referenceElem) => {
        const parent = referenceElem.parentNode,
            nextElem = referenceElem.nextSibling;
        parent.insertBefore(newElement, nextElem);
    },
};
