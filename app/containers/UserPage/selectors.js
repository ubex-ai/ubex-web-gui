import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the userPage state domain
 */

const selectUserPageDomain = state => state.get('user', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by UserPage
 */

const makeSelectUserPage = () =>
	createSelector(
		selectUserPageDomain,
		substate => substate.toJS(),
	);

const fetchUserLoading = () =>
	createSelector(
		selectUserPageDomain,
		substate => substate.get('loading'),
	);
const fetchUserError = () =>
	createSelector(
		selectUserPageDomain,
		substate => substate.get('error'),
	);
const selectUserData = () =>
	createSelector(
		selectUserPageDomain,
		substate =>
			//	debugger;
			substate.get('data').toJS(),
	);
export const selectUserEmail = () =>
	createSelector(
		selectUserPageDomain,
		substate => substate.get('data').get('email'),
	);
export const selectUserGUID = () =>
	createSelector(
		selectUserPageDomain,
		substate => substate.get('data').get('guid'),
	);
export default makeSelectUserPage;
export { makeSelectUserPage, selectUserPageDomain, selectUserData };

/**
 const userShape = [{
	"guid": "f27d7236-06eb-4b50-b115-4afdfd77e6b1",
	"first_name": "ÐÐ½ÑÐ¾Ð½",
	"last_name": "ÐÐ±ÑÐ°Ð¼Ð¾Ð²",
	"email": "hippycore0@gmail.com",
	"username": "hippycore0@gmail.com",
	"date_of_birth": null,
	"address_1": "",
	"address_2": null,
	"postcode": "",
	"phone_number": "9099848068",
	"gender": null,
	"state": null,
	"country": null,
	"region": null,
	"skype": "",
	"city": null,
	"wallets": [{"id": 13, "name": null, "hash_code": null, "type": "ubex"}, {
		"id": 14,
		"name": null,
		"hash_code": null,
		"type": "btc"
	}, {"id": 15, "name": null, "hash_code": null, "type": "eth"}],
	"source_of_financing": [],
	"employment_status": [],
	"is_confirmed": false,
	"telegram": ""
}];
 * */
