import jstimezonedetect from 'jstimezonedetect';

export default function findTimezone(timezones) {
	const offset = new Date().getTimezoneOffset();
	let timezoneName = jstimezonedetect.determine().name();
	let offsetZone = -offset / 60;
	if (timezoneName.indexOf('/') !== -1) {
		timezoneName = timezoneName.split('/')[1];
	} else if (timezoneName.indexOf('_') !== -1) {
		timezoneName = timezoneName.split('/')[1].replace(new RegExp('_', 'g'), '-');
	} else {
		timezoneName = 'London';
		offsetZone = 0;
	}
	const foundTimezone = timezones.filter(
		f => f.label.toLowerCase().indexOf(timezoneName.toLowerCase()) !== -1 && f.offset === offsetZone,
	);
	return foundTimezone && foundTimezone.length ? foundTimezone[0].value : null;
}