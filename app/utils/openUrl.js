export default (url, newTab = true) => {
	if (newTab) {
		const w = window.open(url, '_blank');
		w.focus();
	} else {
		window.location.replace(url);
	}
};
