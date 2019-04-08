import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the passport state domain
 */

const selectPassportDomain = state => state.get('passport', initialState);

/**
 * Other specific selectors
 */
const selectToken = state => state.get('passport', initialState).token;
/**
 * Default selector used by Passport
 */

const makeSelectPassport = () =>
	createSelector(
		selectPassportDomain,
		substate => substate.toJS(),
	);

export default makeSelectPassport;
export { selectPassportDomain, selectToken };
