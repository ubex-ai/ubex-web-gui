import { createSelector } from 'reselect';
import _ from 'lodash';

/**
 * Selectors
 */
export default (domainSelector, collection) => ({
	collectionLoading: () => selectCollectionLoading(domainSelector)(collection),
	collectionError: () => selectCollectionError(domainSelector)(collection),
	collectionList: () => selectCollectionList(domainSelector)(collection),
	addEntryLoading: () => selectAddEntryLoading(domainSelector)(collection),
	addEntryError: () => selectAddEntryError(domainSelector)(collection),
	activeEntryId: () => selectActiveEntryId(domainSelector)(collection),
	activeEntry: () => selectActiveEntry(domainSelector)(collection),
});

export const makeListSelectors = (domainSelector, collection) => ({
	collectionLoading: () => selectCollectionLoading(domainSelector)(collection),
	collectionError: () => selectCollectionError(domainSelector)(collection),
	collectionList: () => selectCollectionList(domainSelector)(collection),
});

export const selectCollectionLoading = domainSelector => collection =>
	createSelector(
		domainSelector,
		substate => substate.get(`${collection}Loading`),
	);

export const selectCollectionError = domainSelector => collection =>
	createSelector(
		domainSelector,
		substate => substate.get(`${collection}Error`),
	);

export const selectAddEntryLoading = domainSelector => collection =>
	createSelector(
		domainSelector,
		substate => substate.get(`${collection}AddEntryLoading`),
	);

export const selectAddEntryError = domainSelector => collection =>
	createSelector(
		domainSelector,
		substate => substate.get(`${collection}AddEntryError`),
	);

export const selectCollectionList = domainSelector => collection =>
	createSelector(
		domainSelector,
		state => state.get(collection).toJS(),
	);

export const selectActiveEntryId = domainSelector => collection =>
	createSelector(
		domainSelector,
		substate => substate.get(`${collection}ActiveEntryId`),
	);

export const selectActiveEntry = domainSelector => collection =>
	createSelector(
		[selectCollectionList(domainSelector)(collection), selectActiveEntryId(domainSelector)(collection)],
		(entries, activeEntryId) => _.findLast(entries, { id: activeEntryId }) || null,
	);
