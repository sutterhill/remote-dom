import React, { useEffect, useState } from 'react';
import publish, { attrs } from './remote-renderer';

function CounterWidget() {
	const [ seconds, setSeconds ] = useState(0);

	useEffect(() => {
		const t = setInterval(() => {
			setSeconds(seconds + 1);
		}, 1000);

		return function cleanup() {
			clearInterval(t);
		}
	});

	let attrsReadable;
	if (Object.keys(attrs).length) {
		attrsReadable = Object.keys(attrs).map((key) => `${key}=${attrs[key]}`).join(', ');
	}

	return <p>Running for {seconds} {seconds === 1 ? 'second' : 'seconds'}. {attrsReadable ? `Our RemoteDOM tag had these attributes on it: ${attrsReadable}` : 'Received no attributes on our RemoteDOM tag.'}</p>;
}

publish(<CounterWidget />)
