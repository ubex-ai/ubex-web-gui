import PropTypes from 'prop-types';
import { INVENTORY_TYPES, INVENTORY_STATUSES } from '../constants';

export default {
	id: PropTypes.number,
	name: PropTypes.string,
	aliases: PropTypes.array,
	type: PropTypes.oneOf([INVENTORY_TYPES.web, INVENTORY_TYPES.android, INVENTORY_TYPES.ios]),
	inventory_id: PropTypes.string,
	status: PropTypes.oneOf([
		INVENTORY_STATUSES.active,
		INVENTORY_STATUSES.disabled,
		INVENTORY_STATUSES.moderation,
		INVENTORY_STATUSES.declined,
	]),
	code: PropTypes.string,
	category_blacklist: [],
	dsp_blacklist: [],
};
