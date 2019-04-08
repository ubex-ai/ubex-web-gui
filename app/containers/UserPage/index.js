/**
 *
 * UserPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import classnames from 'classnames';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { TabContent, TabPane, Nav, NavItem, NavLink, Container, Row, Col, Button, ButtonGroup } from 'reactstrap';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { FormattedMessage } from 'react-intl';
import makeSelectUserPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

import { CompanyTab, PersonalTab } from './components';

/* eslint-disable react/prefer-stateless-function */
export class UserPage extends React.Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: '1',
		};
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab,
			});
		}
	}

	render() {
		return (
			<div>
				<Helmet>
					<title>UserPage</title>
					<meta name="description" content="Description of UserPage" />
				</Helmet>
				<div className="content">
					<Row>
						<Col xs={12} md={12}>
							<div className="page-title">
								<div className="float-left">
									<h1 className="title">
										<FormattedMessage {...messages.profile} />
									</h1>
								</div>
							</div>
							<ButtonGroup>
								<Button
									color="primary"
									onClick={() => this.toggle('1')}
									active={this.state.activeTab === '1'}
								>
									<FormattedMessage {...messages.personalTab} />
								</Button>
								<Button
									color="primary"
									onClick={() => this.toggle('2')}
									active={this.state.activeTab === '2'}
								>
									<FormattedMessage {...messages.companyTab} />
								</Button>
							</ButtonGroup>
							{this.state.activeTab !== '1' ? null : (
								<Row>
									<Col sm="12">
										<PersonalTab />
									</Col>
								</Row>
							)}
							{this.state.activeTab !== '2' ? null : (
								<Row>
									<Col sm="12">
										<CompanyTab />
									</Col>
								</Row>
							)}
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}

UserPage.propTypes = {
	dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
	userPage: makeSelectUserPage(),
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

const withReducer = injectReducer({ key: 'userPage', reducer });
const withSaga = injectSaga({ key: 'userPage', saga });

export default compose(
	withReducer,
	withSaga,
	withConnect,
)(UserPage);
