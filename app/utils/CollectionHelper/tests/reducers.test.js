import { fromJS } from 'immutable';
import {
	updateEntryById,
	onRequestEntry,
	onErrorEntry,
	onSuccessEntry,
} from 'utils/CollectionHelper/reducers/entryReducer';
import { removeEntryById, addEntryWithId } from 'utils/CollectionHelper/reducers/listReducer';
import { collectionReducer } from '../reducers';

describe('collectionHelper entryReducer', () => {
	it('updateEntryById: should update counter by id', () => {
		const state = fromJS({ counters: [{ id: 228, name: 'test', loading: true }] });
		const payload = { id: 228, foo: 'bar', loading: false };
		const result = fromJS({ counters: [{ id: 228, name: 'test', foo: 'bar', loading: false }] });
		expect(updateEntryById('counters')(state, { payload })).toEqual(result);
	});
	it('onSuccessEntry: should disable loading and merge data with counter by id', () => {
		const state = fromJS({ counters: [{ id: 228, name: 'test', loading: true, a: '1', b: '2' }] });
		const payload = { id: 228, a: '2', c: '3' };
		const result = fromJS({
			counters: [{ id: 228, name: 'test', loading: false, error: null, a: '2', b: '2', c: '3' }],
		});
		expect(onSuccessEntry('counters')(state, { payload })).toEqual(result);
	});
	it('onSuccessEntry: should add new entry when no entries with same id in list', () => {
		const state = fromJS({ counters: [{ id: 228, name: 'test' }] });
		const payload = { id: 666, name: 'admin' };
		const result = fromJS({
			counters: [{ id: 228, name: 'test' }, { id: 666, name: 'admin', loading: false, error: null }],
		});
		expect(onSuccessEntry('counters')(state, { payload })).toEqual(result);
	});
	it('onRequestEntry: should set props of counter to on loading  by id', () => {
		const state = fromJS({ counters: [{ id: 228, name: 'test', loading: false, error: new Error('oops') }] });
		const payload = { id: 228 };
		const result = fromJS({ counters: [{ id: 228, name: 'test', loading: true, error: null }] });
		expect(onRequestEntry('counters')(state, { payload })).toEqual(result);
	});
	it('onErrorEntry: should set props of counter for error by id', () => {
		const state = fromJS({ counters: [{ id: 228, name: 'test', loading: true }] });
		const payload = new Error('fixme');
		const meta = { id: 228 };
		const result = fromJS({ counters: [{ id: 228, name: 'test', loading: false, error: payload }] });
		expect(onErrorEntry('counters')(state, { payload, meta })).toEqual(result);
	});
	it('removeEntryById: should remove entry from collection', () => {
		const state = fromJS({
			counters: [{ id: 228, name: 'test', loading: true }, { id: 230, name: 'test', loading: false }],
		});
		const payload = { id: 228 };
		const result = fromJS({ counters: [{ id: 230, name: 'test', loading: false }] });
		expect(removeEntryById('counters')(state, { payload })).toEqual(result);
	});
	it('addEntryWithId: should add entry to empty collection', () => {
		const state = fromJS({ counters: [] });
		const payload = { id: 228, name: 'test' };
		const result = fromJS({ counters: [{ id: 228, name: 'test' }] });
		expect(addEntryWithId('counters')(state, { payload })).toEqual(result);
	});
});

describe('collectionReducer', () => {
	it('should generate actions for collection', () => {
		expect(typeof collectionReducer('counters')['app/Dashboard/ADD_ENTRY_ERROR/counters']).toEqual('function');
	});
});
