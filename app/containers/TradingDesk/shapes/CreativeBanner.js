import PropTypes from 'prop-types';
import CreativeBannerFile from './CreativeBannerFile';
export default {
	id: PropTypes.number.isRequired,
	aws_s3_location: PropTypes.string.isRequired,
	creative_id: PropTypes.number.isRequired,
	callback_url: PropTypes.string,
	files: PropTypes.arrayOf(PropTypes.shape(CreativeBannerFile)),
	height: PropTypes.number,
	width: PropTypes.number,
	name: PropTypes.string,
	upload_name: PropTypes.string.isRequired,
	type: PropTypes.oneOf(['image', 'html5']),
};
