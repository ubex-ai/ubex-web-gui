import { parseErrorMessage, getMessageByCode } from 'utils/request';
import { toPrettyName } from 'utils/strings';

describe('parseErrorMessage', () => {
	describe(' Generate error messages as strong or as array of string from error object', () => {
		it('when take "serialized" error', () => {
			const error = new Error();
			const propName = 'foo';
			error.response = {
				data: {
					[propName]: 'bar',
				},
			};

			expect(parseErrorMessage(error)).toEqual([`${toPrettyName(propName)}: bar`]);
		});

		it('when take an error as string in data', () => {
			const error = new Error();
			error.response = {
				data: {
					errors: 'Something wrong!',
				},
			};
			expect(parseErrorMessage(error)).toEqual('Something wrong!');
		});

		it('when take default error message', () => {
			const error = new Error('Something wrong!');
			expect(parseErrorMessage(error)).toEqual('Something wrong!');
		});

		it('when take unknown error', () => {
			const error = new Error();
			expect(parseErrorMessage(error)).toEqual('Unknown error');
		});
		it('should generate string custom string on 500 code', () => {
			const error = new Error();
			error.response = {
				status: 500,
			};
			expect(parseErrorMessage(error)).toEqual('Server is temporarily unavailable. Try in 5 minutes');
		});

		it('should generate string custom string on on 300', () => {
			const error = new Error();
			error.response = {
				status: 300,
			};
			expect(parseErrorMessage(error)).toEqual('Unexpected redirect');
		});
	});
});

describe('getMessageByCode', () => {
	it('should generate string custom string on 500 code', () => {
		const error = new Error();
		error.response = {
			status: 500,
		};
		expect(getMessageByCode(error.response)).toEqual('Server is temporarily unavailable. Try in 5 minutes');
	});

	it('should generate string custom string on on 300', () => {
		const error = new Error();
		error.response = {
			status: 300,
		};
		expect(getMessageByCode(error.response)).toEqual('Unexpected redirect');
	});
});
