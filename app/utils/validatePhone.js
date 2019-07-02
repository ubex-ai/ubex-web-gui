const validatePhone = (phone, msg) => {
	if (!phone) return false;
	const re = /^([0-9-()+]\d*)$/;
	return !re.test(phone) ? msg || 'Enter valid phone (Only numbers and "-()+")' : undefined;
};
export default validatePhone;
