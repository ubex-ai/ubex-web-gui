import makeCollectionActions, {
	makeAsyncActionsPack,
	GET_COLLECTION_REQUEST,
	GET_COLLECTION_ERROR,
	GET_COLLECTION_SUCCESS,
} from '../constants';

describe('makeAsyncActionsPack', () => {
	it('should generate 3 actions for async flow', () => {
		const result = {
			request: `${GET_COLLECTION_REQUEST}/counters`,
			error: `${GET_COLLECTION_ERROR}/counters`,
			success: `${GET_COLLECTION_SUCCESS}/counters`,
		};

		expect(
			makeAsyncActionsPack(
				{
					request: GET_COLLECTION_REQUEST,
					error: GET_COLLECTION_ERROR,
					success: GET_COLLECTION_SUCCESS,
				},
				'counters',
			),
		).toEqual(result);
	});
});

describe('makeCollectionActions', () => {
	it('should generate actions for collection', () => {
		const result = {
			request: `${GET_COLLECTION_REQUEST}/counters`,
			error: `${GET_COLLECTION_ERROR}/counters`,
			success: `${GET_COLLECTION_SUCCESS}/counters`,
		};

		expect(makeCollectionActions('counters').getCollection).toEqual(result);
	});
});
