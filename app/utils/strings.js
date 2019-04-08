export function toPrettyName(prop) {
	return prop.charAt(0).toUpperCase() + prop.slice(1).replace(/_/g, ' ');
}
