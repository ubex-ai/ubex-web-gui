/**
 *
 * RevenueDashboardCard
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import messages from 'containers/DataMiner/messages';
import DashboardCard from 'components/DashboardCard';
// import styled from 'styled-components';

function RevenueDashboardCard({ revenuePerDay, profitabilityRatio }) {
	const header = (
		<div>
			{revenuePerDay ? revenuePerDay.toFixed(0) : 0} UBEX{' '}
			<span className={profitabilityRatio > 0 ? 'green' : 'red'}>
				<div className="d-inline">
					(
					<i className={profitabilityRatio > 0 ? 'fas fa-caret-up' : 'fas fa-caret-down'} />
					{profitabilityRatio ? profitabilityRatio.toFixed(0) : 0}
					%)
				</div>
			</span>
		</div>
	);

	return (
		<DashboardCard
			popoverProps={{
				popoverHeader: messages.profitabilityPopover,
				popoverBody: messages.profitabilityPopoverText,
			}}
			icon={{ code: 'chart-bar', color: 'icon-purple' }}
			header={header}
			description={<FormattedMessage {...messages.revenueThisDay} />}
		/>
	);
}

RevenueDashboardCard.propTypes = {
	profitabilityRatio: PropTypes.number.isRequired,
	revenuePerDay: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default RevenueDashboardCard;
