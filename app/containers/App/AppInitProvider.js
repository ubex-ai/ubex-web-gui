import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { appInit } from 'containers/Dashboard/actions';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import userReducer from 'containers/UserPage/reducer';

import FullScreenLoader from 'components/FullScreenLoader';
import saga from '../Dashboard/saga';
import reducer from '../Dashboard/reducer';

class AppInitProvider extends React.Component {
	state = {
		storeLoaded: false,
	};

	componentDidMount() {
		// fetch needed data from server on app mount
		this.props.loadStore(() => {
			this.setState({
				storeLoaded: true,
			});
			this.props.dispatch(appInit());
		});
	}

	render() {
		return !this.state.storeLoaded ? <FullScreenLoader /> : this.props.children;
	}
}

const mapStateToProps = () => ({});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);
const withUserReducer = injectReducer({ key: 'user', reducer: userReducer });
const withDashboardReducer = injectReducer({ key: 'dashboard', reducer });
const withSaga = injectSaga({ key: 'dashboard', saga }, 'Dashboard');

AppInitProvider.propTypes = {
	loadStore: PropTypes.func.isRequired,
	dispatch: PropTypes.func.isRequired,
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default compose(
	withConnect,
	withUserReducer,
	withDashboardReducer,
	withSaga,
)(AppInitProvider);
