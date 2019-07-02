import moment from 'moment';
export default function formatDateFromUTC(myDate){
	return moment.utc(myDate);
}
