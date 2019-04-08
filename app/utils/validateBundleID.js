const validateBundleID = (bundle, msg) => {
	if (!bundle) return false;
	const reBundle = /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+[0-9a-z_]$/i;
	return !reBundle.test(bundle) ? msg || 'Enter valid domain' : undefined;
};
export default validateBundleID;
