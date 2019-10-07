import { createSelector } from 'reselect';



export default (domainSelector, collection) => ({
	statsLoading: () => selectStatsLoading(domainSelector)(collection),
	statsError: () => selectStatsError(domainSelector)(collection),
	statsList: () => selectStatsList(domainSelector)(collection),
});

export const makeListSelectors = (domainSelector, collection) => ({
	statsLoading: () => selectStatsLoading(domainSelector)(collection),
	statsError: () => selectStatsError(domainSelector)(collection),
	statsList: () => selectStatsList(domainSelector)(collection),
});

export const selectStatsLoading = domainSelector => collection =>
	createSelector(
		domainSelector,
		substate => substate.get(`${collection}Loading`),
	);

export const selectStatsError = domainSelector => collection =>
	createSelector(
		domainSelector,
		substate => substate.get(`${collection}Error`),
	);

export const selectStatsList = domainSelector => collection =>
	createSelector(
		domainSelector,
		state => state.get(collection).toJS(),
	);