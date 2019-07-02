import validateEmail from './validateEmail';

/**
 * Validate array of emails
 * @param emails
 * @return {*} Array of errors or undefined
 */
const validateEmails = emails => {
	const result = [];
	if (!emails) {
		return ["Email can't be empty"];
	}
	emails
		.filter(email => typeof email !== 'undefined')
		.forEach((email, key) => {
			if (!email || !email.length) {
				result[key] = "Email can't be empty";
			}
			result[key] = validateEmail(email);
		});

	if (!result.length) {
		return undefined;
	}
	return result;
};

export default validateEmails;
