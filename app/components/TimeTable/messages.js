/*
 * DashboardInner Messages
 *
 * This contains all the text for the DashboardInner container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.TimeTable';

export default defineMessages({
	selectAll: {
		id: `${scope}.selectAll`,
		defaultMessage: 'Select all',
	},
	unselectAll: {
		id: `${scope}.unselectAll`,
		defaultMessage: 'Unselect all',
	},
	selectWorkingTime: {
		id: `${scope}.selectWorkingTime`,
		defaultMessage: 'Select working time',
	},
	unselectWorkingTime: {
		id: `${scope}.unselectWorkingTime`,
		defaultMessage: 'Unselect working time',
	},
	selectWeekends: {
		id: `${scope}.selectWeekends`,
		defaultMessage: 'Select weekends',
	},
	unselectWeekends: {
		id: `${scope}.unselectWeekends`,
		defaultMessage: 'Unselect weekends',
	},
	selectWeekedays: {
		id: `${scope}.selectWeekedays`,
		defaultMessage: 'Select weekdays',
	},
	unselectWeekedays: {
		id: `${scope}.unselectWeekedays`,
		defaultMessage: 'Unselect weekdays',
	},
});
