import PropTypes from 'prop-types';

export default {
	id: PropTypes.number,
	categories: PropTypes.array,
	aliases: PropTypes.array,
	embedded_script: PropTypes.string,
};

export const counterListItem = {
	id: PropTypes.number,
	code: PropTypes.string,
};
