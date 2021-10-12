importScripts('jsdom.bundled.js');

console.log('[WORKER] Starting');
const dom = new JSDOM(`<!DOCTYPE html><body>The time is <span id="time">${new Date()}</span></body>`);

function sendHTML() {
	postMessage({
		html: dom.window.document.body.innerHTML,
	});
}

addEventListener('message', ({ data }) => {
	console.log('[WORKER] Main window wants HTML');
	sendHTML();
}, false);

function mutationCallback(mutations) {
	// TODO: serialize mutations and send those over the wire instead of the full HTML if it
	// would be a smaller payload.
	console.log('[WORKER] Mutation:', ...mutations);
	postMessage({
		html: dom.window.document.body.innerHTML,
	});
	sendHTML();
}
const mo = new dom.window.MutationObserver(mutationCallback);
mo.observe(dom.window.document, { attributes: true, childList: true, subtree: true });

setInterval(() => {
	dom.window.document.querySelector('#time').innerHTML = new Date();
}, 1000);
