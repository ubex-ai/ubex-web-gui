/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 *
 * FaqPage
 *
 */

import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Alert, Button, Col, Collapse, Input, Row } from 'reactstrap';
import AppAlertError from 'components/AppAlertError';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import AppCard from 'components/AppCard';
import { getFAQ, setFilterFAQ } from '../../actions';
import messages from '../../messages';
import { faqSelectors, searchFAQ, selectFAQFilter } from '../../selectors';
import LinkButton from '../CampaignGroupsList';

/* eslint-disable react/prefer-stateless-function */
class FaqPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			collapse: [],
			faq: {},
		};
		this.searchEntries = this.searchEntries.bind(this);
		this.clearSearch = this.clearSearch.bind(this);
	}

	componentDidMount() {
		this.props.getFaq();
	}

	componentWillUnmount() {
		this.setState({ search: '' });
		this.props.setFilter({ searchWord: '' });
	}

	toggle(index) {
		if (this.state.collapse === index) {
			this.setState({ collapse: null });
		} else {
			this.setState({ collapse: index });
		}
	}

	renderCategory(categoryAlias, key) {
		const category = this.props.searchFaq[categoryAlias];
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
							className={`accordion-toggle ${this.state.collapse === index && ' collapsed'}`}
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

	searchEntries(e) {
		const typeQuery = e.target.value
			.toString()
			.trim()
			.toLowerCase();
		this.setState({ search: typeQuery });
		this.props.setFilter({ searchWord: typeQuery });
	}

	clearSearch() {
		this.setState({ search: '' });
		this.props.setFilter({ searchWord: '' });
	}

	render() {
		console.log(this.props);
		return (
			<Row className="margin-0">
				<Col md={12} className="title-with-select__other">
					<Row>
						<Col md={10}>
							<div className="page-title">
								<div className="float-left">
									<h1 className="title">FAQ</h1>
								</div>
							</div>
						</Col>
						<Col md={2}>
							<div className="search input">
								<Input
									type="search"
									placeholder={this.props.intl.formatMessage(messages.search)}
									aria-label="Search"
									className="search__input form-control border-5"
									onChange={this.searchEntries}
									value={this.state.search}
								/>
								{this.state.search && (
									<Button
										size="xs"
										className="search__button background-transparent"
										onClick={this.clearSearch}
									>
										<i className="far fa-times-circle" />
									</Button>
								)}
							</div>
						</Col>
					</Row>
					<AppCard>
						{this.props.faqError ? <AppAlertError>{this.props.faqError.message}</AppAlertError> : null}
						{this.props.searchFaq && Object.keys(this.props.searchFaq).length ? (
							Object.keys(this.props.searchFaq).map((key, i) => this.renderCategory(key, i))
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
	faqEntries: PropTypes.array.isRequired,
	faqIsLoading: PropTypes.bool,
	faqError: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
	faqEntries: faqSelectors.collectionList(),
	faqIsLoading: faqSelectors.collectionLoading(),
	faqError: faqSelectors.collectionError(),
	searchFaq: searchFAQ(),
	faqFilter: selectFAQFilter(),
});

function mapDispatchToProps(dispatch) {
	return {
		getFaq: () => dispatch(getFAQ()),
		setFilter: values => dispatch(setFilterFAQ(values)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(injectIntl(FaqPage));
