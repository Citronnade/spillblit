Meteor.startup(function() {
});

Meteor.methods({
	create: function(table) {
		var _id = Tables.insert({table: table.table, name: table.name});
		console.log(_id);
		console.log(Tables.findOne(_id));
		return _id;
	},
	
	enterBills: function(bills) {
		var _id = bills._id;
		bills[bills.name] = bills.bills;
		delete bills._id;
		delete bills.bills;
		delete bills.name;
		console.log(bills);
		//Tables.update(_id, {$set: bills});
		console.log(Tables.findOne(_id));
	}
});

