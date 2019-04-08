/**
 *
 * DashboardCard
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import CardPopover from '../CardPopover';
// import styled from 'styled-components';

function DashboardCard({
	popoverProps,
	icon: { color = 'icon-accent', code = 'users' },
	header = null,
	description = null,
	button = null,
}) {
	return (
		<CardPopover {...popoverProps}>
			<div className="stats dashboardCard__container">
				<div className="row">
					<i className={`fas fa-${code} icon-md icon-rounded ${color} dashboardCard__icon`} />

					<div className="col-lg-6 col-md-6 col-sm-12 dashboardCard__content">
						{header && <h4 className="dashboardCard__title"><strong>{header}</strong></h4>}
						{description && <div className="dashboardCard__description">{description}</div>}
					</div>
					<div className="col-lg-4 col-md-5 col-sm-12 dashboardCard__button">
						{button}
					</div>
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
