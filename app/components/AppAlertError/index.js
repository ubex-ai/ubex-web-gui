/**
 *
 * AppAlertError
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Alert } from 'reactstrap';

const renderMessage = message =>
	typeof message === 'string' ? (
		message
	) : (
		<ul className="AppAlertError__list">
			{message.map(str => (
				<li className="AppAlertError__list-item">{str}</li>
			))}
		</ul>
	);

function AppAlertError({ message }) {
	return (
		<Alert color="danger">
			<div className="AppAlertError__container">
				<h5 className="AppAlertError__header">
					<FormattedMessage id="app.common.error" />
				</h5>
				<div className="AppAlertError__message-container">{renderMessage(message)}</div>
			</div>
		</Alert>
	);
}

AppAlertError.defaultProps = {
	message: 'Unknown error. Try again in 5 minutes.',
};

AppAlertError.propTypes = {
	message: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

export default AppAlertError;
