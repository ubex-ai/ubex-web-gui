const validateFloat = (float, msg) => {
	if (!float) return false;
	const re = /^[0-9]+([.,][0-9]{1,2})?$/;
	return !re.test(float) ? msg || 'Enter valid number (ex.: 512.00)' : undefined;
};
export default validateFloat;
