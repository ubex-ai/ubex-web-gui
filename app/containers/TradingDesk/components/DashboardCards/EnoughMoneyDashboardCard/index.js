/**
 *
 * EnoughMoneyDashboardCard
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import LinkButton from 'components/LinkButton';
import DashboardCard from 'components/DashboardCard';
import messages from '../../../messages';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class EnoughMoneyDashboardCard extends React.Component {
	render() {
		return (
			<DashboardCard
				popoverProps={{
					popoverHeader: messages.enoughMoneyPopover,
					popoverBody: messages.enoughMoneyPopoverText,
				}}
				icon={{ code: 'hand-holding-usd', color: 'icon-success' }}
				header="0/0"
				description={<FormattedMessage {...messages.enoughMoney} />}
				button={
					<LinkButton to="/app/campaigns/add" className="button_payout" color="success" title="Add money to account">
						<FormattedMessage {...messages.addMoney} />
					</LinkButton>
				}
			/>
		);
	}
}

EnoughMoneyDashboardCard.propTypes = {};

export default EnoughMoneyDashboardCard;
