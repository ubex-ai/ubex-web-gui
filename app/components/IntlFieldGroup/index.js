/**
 *
 * IntlFieldGroup
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldGroup } from 'components/FormInputs/FormInputs';

function IntlFieldGroup(props) {
	props.inputProps.name = props.name || props.label.id;

	return (
		<FormattedMessage {...props.label} values={props.intlValues}>
			{msg => <FieldGroup {...props} label={msg} />}
		</FormattedMessage>
	);
}

IntlFieldGroup.propTypes = {
	label: PropTypes.shape({
		id: PropTypes.string,
		defaultMessage: PropTypes.string,
		html: PropTypes.bool,
	}).isRequired,
	name: PropTypes.string,
	inputProps: PropTypes.object,
	intlValues: PropTypes.object,
};

IntlFieldGroup.defaultProps = {
	inputProps: {
		type: 'text',
	},
};
export default IntlFieldGroup;
