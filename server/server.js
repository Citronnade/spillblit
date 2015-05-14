Meteor.startup(function () {
    // code to run on server at startup
});

Meteor.methods({
	addBills: function(bills) {
		console.log(bills);
	}
});

