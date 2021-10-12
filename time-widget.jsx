import React, { useEffect, useState } from 'react';
import publish from './remote-renderer';

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

publish(<TimeWidget />)
