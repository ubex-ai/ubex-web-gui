import axios from 'axios';
import { toPrettyName } from 'utils/strings';

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
	if (response.status === 204 || response.status === 205) {
		return null;
	}
	if (typeof response.json === 'function') {
		return response.json();
	}
	return response;
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
	if (!response) {
		throw new Error('Unknown network error: server not response');
	}

	if (response.status >= 200 && response.status < 300) {
		return response;
	}

	const error = new Error(response.statusText);
	error.response = response;
	error.message = parseErrorMessage(error);
	throw error;
}

/**
 * Generate a error messages as strong or as array of string from error object
 *
 * @param {object} response
 * @param {object} [response.data]
 * @param {string} [response.data.errors]
 * @param {number} [response.status]
 * @param {string} [response.statusText]
 * @param {string} [message]
 *
 * @return {string | string[]}
 */
export function parseErrorMessage({ response, message }) {
	if (response && typeof response.data === 'object') {
		if (response.data.errors && typeof response.data.errors === 'string') {
			return response.data.errors.toString();
		}
		return Object.keys(response.data).map(prop => `${toPrettyName(prop)}: ${response.data[prop].toString()}`);
	}
	if (response && response.status) {
		return getMessageByCode(response);
	}

	if (message) {
		return message.toString();
	}

	return 'Unknown error';
}

/**
 * Generate string by error code
 *
 * @param {Object} response
 * @param {number} [response.status]
 * @param {string} [response.statusText]
 * @return {string | null}
 */
export function getMessageByCode(response) {
	const { status, statusText } = response;
	if (status >= 300 && status < 400) {
		return 'Unexpected redirect';
	}
	if (status === 404) {
		return 'Not found';
	}
	if (status >= 400 && status < 500) {
		return 'Bad request';
	}
	if (status >= 500) {
		return 'Server is temporarily unavailable. Try in 5 minutes';
	}
	return statusText || null;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default function request(url, options) {
	console.log('Async request', url, options);
	return axios(url, { ...options })
		.then(checkStatus)
		.then(parseJSON)
		.catch(error => checkStatus(error.response));
}
