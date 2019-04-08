import PropTypes from 'prop-types';

export default {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	id: PropTypes.number,
	label: PropTypes.string,
	ssp: PropTypes.array,
	tag: PropTypes.array,
};
