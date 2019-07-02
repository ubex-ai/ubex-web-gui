import PropTypes from 'prop-types';

export default {
	id: PropTypes.number.isRequired,
	aws_s3_location: PropTypes.string.isRequired,
	file_location: PropTypes.string.isRequired,
};
