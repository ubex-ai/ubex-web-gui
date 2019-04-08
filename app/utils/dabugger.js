const dabugger = () => {
	try {
		console.log(arguments);
		debugger;
	} catch (e) {
		console.log('DaBagger message:', e);
		debugger;
	}
};
