/**
 *
 * Developers
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { Alert, Button, Col, Input, Row } from 'reactstrap';
import AppCard from 'components/AppCard';
import worldwide from 'assets/img/developers/worldwide.png';
import target from 'assets/img/developers/target.png';
import moneybag from 'assets/img/developers/money-bag.png';
import { Form } from 'react-final-form';
import IntlFieldGroup from 'components/IntlFieldGroup';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import validateEmpty from 'utils/validateEmpty';
import validateEmail from 'utils/validateEmail';
import validatePhone from 'utils/validatePhone';
import messages from './messages';
import { selectCountries } from '../../../Dashboard/selectors';
/* eslint-disable react/prefer-stateless-function */
class Developers extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: null,
		};
		this.formRef = null;
		this.renderForm = this.renderForm.bind(this);
	}

	validate(formValues) {
		const errors = {};
		errors.company = validateEmpty(formValues.company);
		if (!validateEmpty(formValues.email)) {
			errors.email = validateEmail(formValues.email);
		} else {
			errors.email = validateEmpty(formValues.email);
		}
		errors.region = validateEmpty(formValues.region);
		if (!validateEmpty(formValues.phone)) {
			errors.phone = validatePhone(formValues.phone);
		} else {
			errors.phone = validateEmpty(formValues.phone);
		}
		return errors;
	}

	onSubmit(values) {}

	renderForm({ handleSubmit, change, errors }) {
		const { countries } = this.props;
		return (
			<form onSubmit={args => handleSubmit(args)}>
				<IntlFieldGroup name="company" label={messages.company} required />
				<IntlFieldGroup
					name="region"
					inputProps={{
						type: 'select',
						options: countries,
					}}
					label={messages.region}
					required
				/>
				<IntlFieldGroup name="email" label={messages.email} required />
				<IntlFieldGroup name="phone" label={messages.phone} required />
				<Button type="submit" color="primary">
					<FormattedMessage id="app.common.submit" />
				</Button>
			</form>
		);
	}

	render() {
		return <div>
				<Row className="margin-0">
					<Col md={12} className="title-with-select__other">
						<Row>
							<Col md={10}>
								<div className="page-title">
									<div className="float-left">
										<h1 className="title">
											<FormattedMessage {...messages.header} />
										</h1>
									</div>
								</div>
							</Col>
						</Row>
						<AppCard>
							<Row className="developers-container">
								<Col md={4} className="mt-5">
									<img src={worldwide} className="developers-container__image" />
									<span>
										<FormattedMessage {...messages.openPlatform} />
									</span>
								</Col>
								<Col md={4} className="mt-5">
									<img src={target} className="developers-container__image" />
									<span>
										<FormattedMessage {...messages.targeting} />
									</span>
								</Col>
								<Col md={4} className="mt-5">
									<img src={moneybag} className="developers-container__image" />
									<span>
										<FormattedMessage {...messages.makeMoney} />
									</span>
								</Col>
							</Row>
						</AppCard>
					</Col>
				</Row>
				<Row className="margin-0">
					<Col md={6}>
						<AppCard>
							<h2 className="title" style={{ textAlign: 'center' }}>
								<FormattedMessage {...messages.contactUs} />
							</h2>
							<Form validate={formValues => this.validate(formValues)} onSubmit={values => this.onSubmit(values)} ref={c => (this.formRef = c)} render={this.renderForm} />
						</AppCard>
					</Col>
					<Col md={6}>
						<AppCard>
							<h2 className="title" style={{ textAlign: 'center' }}>
								<FormattedMessage {...messages.sspWelcome} />
							</h2>
							<p className="developers-container__text">
								<FormattedHTMLMessage {...messages.developersText} />

								<a href="http://static.ubex.io/UBEX-Manual.zip">
									<Button size="xl" color="success">
										<FormattedHTMLMessage {...messages.downloadManual} />
									</Button>
								</a>
							</p>
						</AppCard>
					</Col>
				</Row>
			</div>;
	}
}

Developers.propTypes = {
	countries: PropTypes.array,
	match: PropTypes.object,
};
const mapStateToProps = createStructuredSelector({
	countries: selectCountries(),
});
function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}
const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(Developers);
