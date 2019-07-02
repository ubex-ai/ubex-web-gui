/**
 *
 * AdCampaignsDashboardCard
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import DashboardCard from 'components/DashboardCard';
import LinkButton from 'components/LinkButton';
import messages from '../../../messages';

const AdCampaignsDashboardCard = () => (
	<DashboardCard
		popoverProps={{
			popoverHeader: messages.adCampaignsPopover,
			popoverBody: messages.adCampaignsPopoverText,
		}}
		icon={{ code: 'ad', color: 'icon-accent' }}
		header="0/0"
		description={<FormattedMessage {...messages.adCampaigns} />}
		button={
			<LinkButton to="/app/campaigns/add" className="button_workers" color="accent" title="Add campaign">
				<FormattedMessage {...messages.addCampaigns} />
			</LinkButton>
		}
	/>
);

export default AdCampaignsDashboardCard;
