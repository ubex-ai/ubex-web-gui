/**
 *
 * DashboardCard
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import CardPopover from 'components/CardPopover';

function DashboardCard({
	popoverProps,
	icon: { color = 'icon-accent', code = 'users' },
	header = null,
	description = null,
	button = null,
}) {
	return (
		<CardPopover {...popoverProps}>
			<i className={`float-left fas fa-${code} icon-md icon-rounded ${color} dashboardCard__icon`} />
			<div className="stats dashboardCard__container">
				{header && (
					<div className="dashboardCard__text">
						<h4 className="dashboardCard__title">
							<strong>{header}</strong>
						</h4>
						{description && <div className="dashboardCard__description">{description}</div>}
					</div>
				)}
				<div className="dashboardCard__button">
					{button}
				</div>
			</div>
		</CardPopover>
	);
}

DashboardCard.propTypes = {
	popoverProps: PropTypes.shape({
		popoverHeader: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		popoverBody: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	}),
	icon: PropTypes.shape({
		color: PropTypes.string,
		code: PropTypes.string,
	}),
	header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	button: PropTypes.node,
};

export default DashboardCard;
