

export default function getGeneratePageURL(html){
	const getBlobURL = (code, type) => {
		const blob = new Blob([code], { type });
		return URL.createObjectURL(blob);
	};

	return getBlobURL(html, 'text/html');
}
