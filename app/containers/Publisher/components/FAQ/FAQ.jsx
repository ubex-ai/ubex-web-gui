/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 *
 * FaqPage
 *
 */

import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Alert, Col, Collapse, Row } from 'reactstrap';
import AppAlertError from 'components/AppAlertError';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import AppCard from 'components/AppCard';
import { getFAQ } from '../../actions';
import messages from '../../messages';
import { faqSelectors } from '../../selectors';

/* eslint-disable react/prefer-stateless-function */
class FaqPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			collapse: [],
		};
	}

	componentDidMount() {
		this.props.getFaq();
	}

	toggle(index) {
		if (this.state.collapse === index) {
			this.setState({ collapse: null });
		} else {
			this.setState({ collapse: index });
		}
	}

	renderCategory(categoryAlias, key) {
		const category = this.props.faqEntries[categoryAlias];
		return (
			<div className="faq-category" key={key}>
				<h3 className="faq-category__header">{category.name}</h3>
				{category.qa.map((quEntry, index) => this.renderQaEntry(quEntry, index))}
			</div>
		);
	}

	renderQaEntry({ question, answer }, index) {
		return (
			<div className="panel panel-default" key={index}>
				<div className="panel-heading">
					<h4 className="panel-title">
						<a
							className={`accordion-toggle${this.state.collapse === index && ' collapsed'}`}
							onClick={e => this.toggle(index)}
							id={`accordion_${index + 1}`}
						>
							{question}
						</a>
					</h4>
				</div>
				<Collapse isOpen={this.state.collapse === index}>
					<div className="panel-body">
						<p>{answer}</p>
					</div>
				</Collapse>
			</div>
		);
	}

	render() {
		return (
			<Row className="margin-0">
				<Col xs={12} md={12}>
					<div className="page-title">
						<div className="float-left">
							<h1 className="title">
								<FormattedMessage {...messages.faqHeader} />
							</h1>
						</div>
					</div>
					<AppCard>
						{this.props.faqError ? <AppAlertError>{this.props.faqError.message}</AppAlertError> : null}
						{this.props.faqEntries && Object.keys(this.props.faqEntries).length ? (
							Object.keys(this.props.faqEntries).map((key, i) => this.renderCategory(key, i))
						) : (
							<Alert color="primary">
								<FormattedMessage id="app.common.noEntries" defaultMessage="No entries" />
							</Alert>
						)}
					</AppCard>
				</Col>
			</Row>
		);
	}
}

FaqPage.propTypes = {
	getFaq: PropTypes.func.isRequired,
	faqEntries: PropTypes.object.isRequired,
	faqIsLoading: PropTypes.bool,
	faqError: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
	faqEntries: faqSelectors.collectionList(),
	faqIsLoading: faqSelectors.collectionLoading(),
	faqError: faqSelectors.collectionError(),
});

function mapDispatchToProps(dispatch) {
	return {
		getFaq: () => dispatch(getFAQ()),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(FaqPage);
