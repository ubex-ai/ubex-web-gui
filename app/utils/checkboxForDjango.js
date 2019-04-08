/**
 * convert checkbox val to django boolean format
 * @param {boolean | string | number } val
 * @return {boolean} django boolean format
 */
const checkboxForDjango = val => {
	if (!val) {
		return false;
	}
	return typeof val !== 'boolean' ? val.length > 0 : val;
};

export default checkboxForDjango;
