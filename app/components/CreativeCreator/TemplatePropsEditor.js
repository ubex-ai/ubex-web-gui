/**
 *
 * Dummy
 *
 */

import React from 'react';
import IntlFieldGroup from 'components/IntlFieldGroup';
import { Form } from 'react-final-form';
import PropTypes from 'prop-types';
import messages, { scope } from './messages';
import Uploader from './MediaUploader';
// import styled from 'styled-components';

class TemplatePropsEditor extends React.Component {
	renderTextField(fieldKey) {
		return (
			<div>
				<IntlFieldGroup
					name={fieldKey}
					key={fieldKey}
					inputProps={{
						type: 'input',
						value: this.props.templateProps[fieldKey],
						onChange: e => this.props.onChangeProp(fieldKey, e.target.value),
					}}
					label={messages[fieldKey]}
					html
				/>
			</div>
		);
	}


	renderImageField() {
		return (
			<Uploader
				type="image"
				eventHandlers={{
					addedfile: file => this.props.onChangeProp('bgImage', file && URL.createObjectURL(file)),
				}}
			/>
		);
	}

	renderForm(values) {
		return Object.keys(this.props.templateProps).map(fieldKey => {
			switch (fieldKey) {
				case 'bgImage':
					return this.renderImageField();
				default:
					return this.renderTextField(fieldKey);
			}
		});
	}

	validate(values) {
		return true;
	}

	onSubmit(values) {}

	render() {
		return (
			<div>
				<h2>TemplatePropsEditForm</h2>
				<Form
					validate={formValues => this.validate(formValues)}
					initialValues={this.props.templateProps}
					onSubmit={values => this.onSubmit(values)}
					ref={c => (this.formRef = c)}
					render={values => this.renderForm(values)}
				/>
			</div>
		);
	}
}

TemplatePropsEditor.propTypes = {
	onChangeProp: PropTypes.func.isRequired,
	templateProps: PropTypes.shape({
		mainTextColor: PropTypes.string.isRequired,
		mainTextVal: PropTypes.string.isRequired,
		additionalTextColor: PropTypes.string.isRequired,
		additionalTextVal: PropTypes.string.isRequired,
		bgImage: PropTypes.string.isRequired,
	}),
};

export default TemplatePropsEditor;
