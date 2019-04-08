/**
 *
 * UnpaidBalanceDashboardCard
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from 'containers/DataMiner/messages';
import DashboardCard from 'components/DashboardCard';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

function UnpaidBalanceDashboardCard() {
	return (
		<DashboardCard
			popoverProps={{
				popoverHeader: messages.unpaidBalancePopover,
				popoverBody: messages.unpaidBalancePopoverText,
			}}
			icon={{ code: 'coins', color: 'icon-f0ad4e' }}
			header="0 UBEX (soon)"
			description={<FormattedMessage {...messages.unpaidBalance} />}
		/>
	);
}

UnpaidBalanceDashboardCard.propTypes = {};

export default UnpaidBalanceDashboardCard;
