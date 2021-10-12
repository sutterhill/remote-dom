import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

importScripts('jsdom.bundled.js');

console.log('[WORKER] Starting');
const dom = new JSDOM(`<!DOCTYPE html><div id="react-container"></div></html>`);
globalThis.window = dom.window;

function TimeWidget() {
	const [ date, setDate ] = useState(new Date());

	useEffect(() => {
		const t = setInterval(() => {
			setDate(new Date());
		});

		return () => clearInterval(t);
	}, []);

	return <p>The time is {date.toString()}</p>;
}

function mutationCallback(mutations) {
	// TODO: serialize mutations and send those over the wire instead of the full HTML if it
	// would be a smaller payload.
	console.log('[WORKER] Mutation:', ...mutations);
	postMessage({
		html: dom.window.document.body.innerHTML,
	});
}
const mo = new dom.window.MutationObserver(mutationCallback);
mo.observe(dom.window.document.body, { attributes: true, childList: true, subtree: true, characterData: true });

const el = dom.window.document.querySelector('#react-container');
ReactDOM.render(<TimeWidget />, el);
