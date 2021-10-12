import React from 'react';
import ReactDOM from 'react-dom';

importScripts('jsdom.bundled.js');

console.log('[WORKER] Starting');
const dom = new JSDOM(`<!DOCTYPE html><div id="react-container">...</div></html>`);
globalThis.window = dom.window;

function renderReact() {
	const el = dom.window.document.querySelector('#react-container');
	ReactDOM.render(<p>The time is <span id="time">{(new Date()).toString()}</span></p>, el);
}

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
mo.observe(dom.window.document.body, { attributes: true, childList: true, subtree: true, characterData: true });

renderReact();

setInterval(() => {
	renderReact();
}, 1000);
