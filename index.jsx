console.log('[MAIN] Starting');

const el = document.querySelector('#remote-dom');

const mo = new MutationObserver(mutationCallback);
const worker = new Worker('./worker.bundled.js')

function mutationCallback() {
	// Hey! No one else is allowed to touch our DOM
	console.warn('[MAIN] DOM interference detected, killing worker');
	worker.terminate();
	mo.disconnect();
	el.style.border = '1px solid red;';
	el.innerHTML = '😢 Aw, snap! Someone else mutated the DOM.';
}

worker.addEventListener('error', (...args) => {
	console.error('[MAIN] Worker error:', ...args);
	worker.terminate();
	mo.disconnect();
	el.style.border = '1px solid red;';
	el.innerHTML = '😢 Aw, snap! Worker encountered an error.';
});

worker.addEventListener('message', ({ data }) => {
	if (data.html) {
		console.log('[MAIN] Received HTML', data.html);
		mo.disconnect();
		el.innerHTML = data.html;
		mo.observe(el, { attributes: true, childList: true, subtree: true });
	} else if (data.mutations) {
		// TODO deserialize and apply mutations
	}
});

worker.postMessage('foo');
