import React, { Component } from 'react';
import { FormGroup, Label, Input, InputGroup, InputGroupAddon, FormFeedback, FormText } from 'reactstrap';
import { Field } from 'react-final-form';
import PropTypes from 'prop-types';
import messages from '../../containers/TradingDesk/components/CampaignForm/messages';
import { FormattedMessage } from 'react-intl';

export class FieldGroup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			focus: false,
		};
	}

	renderError({ error, touched, invalid }) {
		return invalid && touched && <FormFeedback invalid="true">{error}</FormFeedback>;
	}

	renderRadio() {
		const { label, labelProps, inputProps, required } = this.props;
		return <Field {...inputProps}>
				{({ input, meta }) => <div className="checkbox-wrapper">
						<Label {...labelProps}>
							<div>
								<Input {...inputProps} onChange={e => input.onChange(inputProps.type === 'radio' ? e.target.value : e.target.checked)} invalid={meta.invalid && meta.touched} />
							</div>
							<span className="form-check-sign" />
							<span dangerouslySetInnerHTML={{ __html: label }} />
							{required && <span style={{ color: '#f00' }}>*</span>}
						</Label>
						{this.renderError(meta)}
					</div>}
			</Field>;
	}

	renderSelect() {
		const { label, labelProps, inputProps, required, disableDefault } = this.props;
		return (
			<div>
				{label ? <Label {...labelProps}>{label} {required && <span style={{color: '#f00'}}>*</span>}</Label> : ''}
				<Field {...inputProps}>
					{({ input, meta }) => (
						<div>
							<Input
								{...inputProps}
								{...input}
								options=""
								onChange={e => {
									input.onChange(e);
									if (typeof inputProps.onChange === 'function') {
										inputProps.onChange(e);
									}
								}}
								invalid={meta.invalid && meta.touched}
							>
								{!disableDefault && <option value="">Please, select one...</option>}
								{inputProps.options.map((o, i) => (
									<option value={o.value} key={o.value || i}>
										{o.label}
									</option>
								))}
							</Input>
							{this.renderError(meta)}
						</div>
					)}
				</Field>
			</div>
		);
	}

	renderText() {
		const { label, labelProps, prepend, inputProps, formText, required } = this.props;
		return (
			<div>
				{label ? <Label {...labelProps}>{label} {required && <span style={{color: '#f00'}}>*</span>}</Label> : ''}
				<Field {...inputProps}>
					{({ input, meta }) => (
						<div>
							<InputGroup>
								{prepend && <InputGroupAddon addonType="prepend">{prepend}</InputGroupAddon>}
								<Input
									{...input}
									{...inputProps}
									invalid={meta.invalid && meta.touched}
									innerRef={input => (this.projectNameRef = input)}
								/>
							</InputGroup>
							{formText && <FormText color="muted"><FormattedMessage {...formText} /></FormText>}
							{this.renderError(meta)}
						</div>
					)}
				</Field>
			</div>
		);
	}

	renderByType(type) {
		switch (type) {
			case 'checkbox':
			case 'radio':
				return this.renderRadio();
			case 'select':
				return this.renderSelect();
			default:
				return this.renderText();
		}
	}

	render() {
		const {
			label,
			addonLeft,
			addonRight,
			formGroupProps,
			labelProps,
			inputProps,
			inputGroupProps,
			inputGroupAddonProps,
			InputGroupButtonProps,
		} = this.props;
		let classes = ' ';
		if (inputGroupProps !== undefined) {
			if (inputGroupProps.className !== undefined) {
				classes += `${inputGroupProps.className} `;
			}
		}
		if (addonLeft !== undefined || addonRight !== undefined)
			return (
				<InputGroup {...inputGroupProps} className={classes + (this.state.focus ? 'input-group-focus' : '')}>
					{addonLeft !== undefined ? (
						<InputGroupAddon {...inputGroupAddonProps}>{addonLeft}</InputGroupAddon>
					) : (
						''
					)}
					{this.renderByType(inputProps.type)}

					{addonRight !== undefined ? (
						<InputGroupAddon {...inputGroupAddonProps}>{addonRight}</InputGroupAddon>
					) : (
						''
					)}
				</InputGroup>
			);
		return (
			<FormGroup {...formGroupProps} className={inputProps.type === 'radio' ? 'form-check-radio' : ''}>
				{this.renderByType(inputProps.type)}
			</FormGroup>
		);
	}
}

export class FormInputs extends Component {
	render() {
		const row = [];
		for (let i = 0; i < this.props.ncols.length; i++) {
			row.push(
				<div key={i} className={this.props.ncols[i]}>
					<FieldGroup {...this.props.proprieties[i]} />
				</div>,
			);
		}
		return <div className="row">{row}</div>;
	}
}

FormInputs.propTypes = {
	ncols: PropTypes.arrayOf(PropTypes.string),
	proprieties: PropTypes.arrayOf(PropTypes.object),
};

export default FormInputs;
