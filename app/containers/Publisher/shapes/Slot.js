import PropTypes from 'prop-types';

import BannerModel from './Banner';
export default {
	name: PropTypes.string,
	floor_price_cpm: PropTypes.number,
	banner: PropTypes.shape(BannerModel),
	category_blacklist: PropTypes.array,
	blocked_ad_attribute: PropTypes.array,
	inventory: PropTypes.number,
	is_allowed_acceptable_size: PropTypes.bool,
	is_pc: PropTypes.bool,
	is_mobile: PropTypes.bool,
	is_tablet: PropTypes.bool,
	position: PropTypes.number,
	back_fill: PropTypes.string,
	not_exact_size: PropTypes.bool,
	optimal_floor_price: PropTypes.bool,
	embedding_code: PropTypes.string,
};
