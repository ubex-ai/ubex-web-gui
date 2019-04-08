/**
 *
 * DomainDynamicField
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { FieldGroup } from 'components/FormInputs/FormInputs';
import { FormattedMessage } from 'react-intl';
// import styled from 'styled-components';

class DomainDynamicField extends React.Component {
	componentWillUnmount() {
		this.props.changeValue(this.props.name, undefined);
	}

	render() {
		const { index, msg, onClickRemove, name } = this.props;

		return (
			<FieldGroup
				label={msg}
				id={`alias_${index}`}
				inputProps={{ type: 'text', name }}
				inputGroupProps={{
					className: 'form-group',
				}}
				inputGroupAddonProps={{
					addonType: 'append',
				}}
				addonRight={
					<Button onClick={e => onClickRemove(e, index)} color="danger" className="button-margin-top-3">
						<FormattedMessage id="app.common.remove" />
					</Button>
				}
			/>
		);
	}
}

DomainDynamicField.propTypes = {
	index: PropTypes.number.isRequired,
	msg: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	onClickRemove: PropTypes.func.isRequired,
	changeValue: PropTypes.func.isRequired,
};

export default DomainDynamicField;
