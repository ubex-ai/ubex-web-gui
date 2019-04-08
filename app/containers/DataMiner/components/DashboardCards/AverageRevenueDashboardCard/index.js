/**
 *
 * AverageRevenueDashboardCard
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import messages from 'containers/DataMiner/messages';
import DashboardCard from 'components/DashboardCard';
import { FormattedMessage } from 'react-intl';

function AverageRevenueDashboardCard({ average }) {
	const header = (
		<span>
			{average.toFixed(0)} UBEX / <FormattedMessage {...messages.day} />
		</span>
	);
	return (
		<DashboardCard
			popoverProps={{
				popoverHeader: messages.averageProfitabilityPopover,
				popoverBody: messages.averageProfitabilityPopoverText,
			}}
			icon={{ code: 'chart-line', color: 'icon-337ab7' }}
			header={header}
			description={<FormattedMessage {...messages.averageRevenue} />}
		/>
	);
}

AverageRevenueDashboardCard.propTypes = {
	average: PropTypes.number.isRequired,
};

export default AverageRevenueDashboardCard;
