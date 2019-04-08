// ##############################
// // // top bar dropdown data
// #############################

export const messages = [
	{
		avatar: 'images/profile/avatar-1.png',
		name: 'Clarrie Vasar',
		time: '15 mins ago',
		status: 'available',
		type: 'read',
		msg: 'Sometimes it takes a lifetime to win a battle!',
	},
	{
		avatar: 'images/profile/avatar-2.png',
		name: 'Brooks Shaw',
		time: '35 mins ago',
		status: 'busy',
		type: 'read',
		msg: 'Sometimes it takes a lifetime to win a battle!',
	},
	{
		avatar: 'images/profile/avatar-3.png',
		name: 'Carrie Busey',
		time: '45 mins ago',
		status: 'away',
		type: 'unread',
		msg: 'Sometimes it takes a lifetime to win a battle!',
	},
	{
		avatar: 'images/profile/avatar-4.png',
		name: 'Kate Denwer',
		time: '50 mins ago',
		status: 'offline',
		type: 'read',
		msg: 'Sometimes it takes a lifetime to win a battle!',
	},
];

export const notifications = [
	{ icon: 'check', title: 'Server Needs Reboot', time: '10 mins ago', status: 'available', type: 'read' },
	{ icon: 'envelope', title: 'New Message in Inbox', time: '33 mins ago', status: 'busy', type: 'read' },
	{ icon: 'times', title: 'Server IP blocked', time: '25 mins ago', status: 'away', type: 'unread' },
	{ icon: 'user', title: 'Maintainance Scheduled', time: '40 mins ago', status: 'offline', type: 'read' },
];

// chat bar data
export const chatgroups = [
	{ name: 'Family', color: 'available' },
	{ name: 'Friends', color: 'away' },
	{ name: 'Work', color: 'busy' },
];

export const favcontacts = [
	{ avatar: 'images/profile/avatar-1.png', name: 'Clarrie Vasar', status: 'available' },
	{ avatar: 'images/profile/avatar-2.png', name: 'Brooks Shaw', status: 'busy' },
	{ avatar: 'images/profile/avatar-3.png', name: 'Carrie Busey', status: 'away' },
	{ avatar: 'images/profile/avatar-4.png', name: 'Kate Denwer', status: 'offline' },
];

export const allcontacts = [
	{ avatar: 'images/profile/avatar-2.png', name: 'Brooks Shaw', status: 'busy' },
	{ avatar: 'images/profile/avatar-1.png', name: 'Clarrie Vasar', status: 'available' },
	{ avatar: 'images/profile/avatar-4.png', name: 'Kate Denwer', status: 'offline' },
	{ avatar: 'images/profile/avatar-3.png', name: 'Carrie Busey', status: 'away' },
	{ avatar: 'images/profile/avatar-2.png', name: 'Brooks Shaw', status: 'busy' },
	{ avatar: 'images/profile/avatar-1.png', name: 'Clarrie Vasar', status: 'available' },
	{ avatar: 'images/profile/avatar-4.png', name: 'Kate Denwer', status: 'offline' },
	{ avatar: 'images/profile/avatar-3.png', name: 'Carrie Busey', status: 'away' },
	{ avatar: 'images/profile/avatar-2.png', name: 'Brooks Shaw', status: 'busy' },
	{ avatar: 'images/profile/avatar-1.png', name: 'Clarrie Vasar', status: 'available' },
	{ avatar: 'images/profile/avatar-4.png', name: 'Kate Denwer', status: 'offline' },
	{ avatar: 'images/profile/avatar-3.png', name: 'Carrie Busey', status: 'away' },
];

export default {
	chatgroups, // chat groups for chat area in right sidebar
	favcontacts, // favourite contacts for chat area in right sidebar
	allcontacts, // all contacts for chat area in right sidebar
	messages, // messages list for top bar messages drop down
	notifications, // data for <thead> of table in TableList view
};
