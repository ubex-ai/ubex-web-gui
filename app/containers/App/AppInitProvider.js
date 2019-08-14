import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { appInit } from 'containers/Dashboard/actions';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import userReducer from 'containers/UserPage/reducer';
import FullScreenLoader from 'components/FullScreenLoader';
import saga from 'containers/Dashboard/saga';
import reducer from 'containers/Dashboard/reducer';
import activeContainerRig from 'containers/ContainerManager';

class AppInitProvider extends React.Component {
	persistor = null;

	state = {
		storeLoaded: false,
	};

	componentDidMount() {
		// fetch needed data from server on app mount
		this.persistor = this.props.loadStore(() => {
			this.setState(
				{
					storeLoaded: true,
				},
				() => this.props.dispatch(appInit()),
			);
		});
	}

	render() {
		/**
		 redux-persist/autoRehydrate: 1 actions were fired before rehydration completed. This can be a symptom of a race
		 condition where the rehydrate action may overwrite the previously affected state. Consider running these actions
		 after rehydration:
		 [{…}]
		 0:
		 payload: {location: {…}, action: "POP"}
		 type: "@@router/LOCATION_CHANGE"
		 */
		return !this.state.storeLoaded ? (
			<FullScreenLoader />
		) : (
			React.Children.map(this.props.children, child =>
				React.cloneElement(this.props.children, { persistor: this.persistor }),
			)
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(
	() => ({}),
	mapDispatchToProps,
);
const withUserReducer = injectReducer({ key: 'user', reducer: userReducer });
const withDashboardReducer = injectReducer({ key: 'dashboard', reducer });
const withSaga = injectSaga({ key: 'dashboard', saga }, 'Dashboard');
const withContainerReducer = injectReducer({ key: activeContainerRig.storeName, reducer: activeContainerRig.reducer });
const withContainerSaga = injectSaga({ key: activeContainerRig.storeName, saga: activeContainerRig.saga });

AppInitProvider.propTypes = {
	loadStore: PropTypes.func.isRequired,
	dispatch: PropTypes.func.isRequired,
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default compose(
	withConnect,
	withUserReducer,
	withDashboardReducer,
	withContainerReducer,
	withContainerSaga,
	withSaga,
)(AppInitProvider);
