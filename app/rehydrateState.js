/**
 * Rehydrate State Composer
 */
import activeContainer from 'containers/ContainerManager';
import { rehydrateState as userPageRehydrateState } from 'containers/UserPage/reducer';
import { rehydrateState as dashboardRehydrateState } from 'containers/Dashboard/reducer';

const appRehydrateState = {
	user: userPageRehydrateState,
	dashboard: dashboardRehydrateState,
};

appRehydrateState[activeContainer.storeName] = activeContainer.rehydrateState;

export default appRehydrateState;
