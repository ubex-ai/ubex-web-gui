import { toast, Slide } from 'react-toastify';

export default function createToast(type, text){
	return toast[type](text, {
		position: 'top-right',
		autoClose: 7000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: false,
		pauseOnFocusLoss: false,
		transition: Slide,
	});
}
