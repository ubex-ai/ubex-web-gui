const validateDomainWithoutHttp = (domain, msg) => {
	if (!domain) return false;
	const re = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/igm;
	return !re.test(domain) ? msg || 'Enter valid domain' : undefined;
};
export default validateDomainWithoutHttp;
