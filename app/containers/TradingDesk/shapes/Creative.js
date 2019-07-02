import PropTypes from 'prop-types';
import CreativeBanner from './CreativeBanner';

export default {
	id: PropTypes.number,
	banners: PropTypes.arrayOf(PropTypes.shape(CreativeBanner)),
	creative_type: PropTypes.oneOf(['display', 'native', 'video']),
	campaings: PropTypes.arrayOf(PropTypes.number),
	data: PropTypes.object.isRequired, // TODO: detailed,
	error: PropTypes.object,
	loading: PropTypes.bool.isRequired,
};
