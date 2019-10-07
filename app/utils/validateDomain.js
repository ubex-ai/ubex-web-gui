const validateDomain = (domain, msg) => {
	if (!domain) return false;
	const re = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|tel:)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;
	return !re.test(domain) ? msg || 'Enter valid domain (example: https://ubex.com)' : undefined;
};
export default validateDomain;
