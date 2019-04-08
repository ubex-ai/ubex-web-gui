import validateDomain from './validateDomain';

/**
 * Validate array of aliases string-names as domain name
 * @param aliases
 * @return {*} Array of errors or undefined
 */
const validateAliases = aliases => {
	const result = [];
	if (!aliases) {
		return ["Domain alias can't be empty"];
	}
	aliases
		.filter(alias => typeof alias !== 'undefined')
		.forEach((alias, key) => {
			if (!alias || !alias.length) {
				result[key] = "Domain alias can't be empty";
			}
			result[key] = validateDomain(alias);
		});

	if (!result.length) {
		return undefined;
	}
	return result;
};

export default validateAliases;
