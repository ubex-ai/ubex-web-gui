const validateInteger = (integer, msg) => {
	if (!integer) return false;
	const re = /^(0|[1-9]\d*)$/;
	return !re.test(integer) ? msg || 'Enter valid number' : undefined;
};
export default validateInteger;
