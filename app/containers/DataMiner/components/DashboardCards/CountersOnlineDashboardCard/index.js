/**
 *
 * CountersOnlineDashboardCard
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import LinkButton from 'components/LinkButton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import messages from 'containers/DataMiner/messages';
import DashboardCard from 'components/DashboardCard';
// import styled from 'styled-components';

function CountersOnlineDashboardCard({ online = 0, all = 0 }) {
	return (
		<DashboardCard
			popoverProps={{
				popoverHeader: messages.onlineCountersPopover,
				popoverBody: messages.onlineCountersPopoverText,
			}}
			icon={{ code: 'users', color: 'icon-accent' }}
			header={`${online} / ${all}`}
			description={<FormattedMessage {...messages.countersOnline} />}
			button={
				<LinkButton to="/app/counter/add" className="button_workers" color="accent">
					<FormattedMessage {...messages.addCounter} />
				</LinkButton>
			}
		/>
	);
}

CountersOnlineDashboardCard.propTypes = {
	all: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	online: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CountersOnlineDashboardCard;
