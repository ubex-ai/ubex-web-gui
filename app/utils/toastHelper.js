import { toast, Slide } from 'react-toastify';
import React from 'react';

const Foo = text => (
	<div>
		<i className="fal fa-bell" style={{ marginRight: '10px', marginLeft: '5px' }} />
		{text}
	</div>
);

export default function createToast(type, text) {
	return toast[type](Foo(text), {
		position: 'top-right',
		autoClose: 3500,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: false,
		pauseOnFocusLoss: false,
		transition: Slide,
	});
}
