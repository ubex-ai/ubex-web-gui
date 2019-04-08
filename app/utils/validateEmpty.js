/**
 * Validate value on empty
 * @param value
 * @param msg
 * @return {*} String message or undefined
 */
const validateEmpty = (value, msg = 'Required') => {
	if (!value || value.length <= 0) {
		return msg;
	}
	return undefined;
};

export default validateEmpty;
