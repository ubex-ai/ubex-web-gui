import moment from 'moment';
export default function formatDateFromUTC(myDate){
	const ts = moment.utc(myDate);
	return ts.local();
}
