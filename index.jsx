console.log('[MAIN] Starting');

const VERBOSE_LOGGING = false;

function initRemoteDom(workerSrc, el) {
	const attributes = {};
	Array.from(el.attributes).forEach((attr) => {
		if (attr.name === 'src') return;
		attributes[attr.name] = attr.value;
	});

	console.log('[MAIN] Creating worker', workerSrc, 'attached to', el, 'with attributes', attributes);

	// Note: totally misusing `name` here to synchronously pass attributes over; non-hack solution TBD.
	// We probably have to pass them in via a postMessage that the workers wait for before starting
	// to render.
	const worker = new Worker(workerSrc, { name: JSON.stringify(attributes) });

	const mo = new MutationObserver(() => {
		// Hey! No one else is allowed to touch our DOM
		console.warn('[MAIN] DOM interference detected, killing worker');
		worker.terminate();
		mo.disconnect();
		el.style.border = '1px solid red;';
		el.innerHTML = '😢 Aw, snap! Someone else mutated the DOM.';
	});

	worker.addEventListener('error', (...args) => {
		console.error('[MAIN] Worker error:', ...args);
		worker.terminate();
		mo.disconnect();
		el.style.border = '1px solid red;';
		el.innerHTML = '😢 Aw, snap! Worker encountered an error.';
	});
	
	worker.addEventListener('message', ({ target, data }) => {
		if (target !== worker) return;
	
		if (data.html) {
			if (VERBOSE_LOGGING) console.log('[MAIN] Received HTML from worker', worker, data.html);
			mo.disconnect();
			el.innerHTML = data.html;
			mo.observe(el, { attributes: true, childList: true, subtree: true });
		} else if (data.mutations) {
			// TODO deserialize and apply mutations
		}
	});	
}

Array.from(document.querySelectorAll('remotedom')).forEach((remoteDom) => {
	const src = remoteDom.getAttribute('src');
	if (!src) return;

	initRemoteDom(src, remoteDom);
});
