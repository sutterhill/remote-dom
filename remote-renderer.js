import ReactDOM from 'react-dom';
importScripts('jsdom.bundled.js');

console.log('[WORKER] Starting');

// Create a JSDOM and make its window available in the global context so React is happy
const CONTAINER_ID = 'react-container';
const dom = new JSDOM(`<!DOCTYPE html><div id="${CONTAINER_ID}"></div></html>`);
globalThis.window = dom.window;

// Watch the JSDOM for mutations and send the HTML back to the main window when changes happen
const mo = new dom.window.MutationObserver((mutations) => {
	// TODO: serialize mutations and send those over the wire instead of the full HTML if it
	// would be a smaller payload.
	console.log('[WORKER] Mutation:', ...mutations);
	postMessage({
		html: dom.window.document.body.innerHTML,
	});
});
mo.observe(dom.window.document.body, { attributes: true, childList: true, subtree: true, characterData: true });


export default function publish(element) {
	const container = dom.window.document.getElementById(CONTAINER_ID)
	ReactDOM.render(element, container);
}
