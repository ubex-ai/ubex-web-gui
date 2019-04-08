import React from 'react';

export default function arrayToOptions(data) {
	return data.map((c, i) => (
		<option key={i} value={i}>
			{c}
		</option>
	));
}
