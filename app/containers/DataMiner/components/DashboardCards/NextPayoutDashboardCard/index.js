/**
 *
 * NextPayoutDashboardCard
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from 'containers/DataMiner/messages';
import DashboardCard from 'components/DashboardCard';
import OrderPaymentForm from '../../Form/OrderPaymentForm';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

function NextPayoutDashboardCard(popoverHeader, popoverBody) {
	return (
		<DashboardCard
			popoverProps={{
				popoverHeader: messages.nextPayoutPopover,
				popoverBody: messages.nextPayoutPopoverText,
			}}
			icon={{ code: 'calendar', color: 'icon-success' }}
			header="Fri, 31 may 2019"
			description={<FormattedMessage {...messages.nextPayout} />}
			button={<OrderPaymentForm />}
		/>
	);
}

NextPayoutDashboardCard.propTypes = {};

export default NextPayoutDashboardCard;
