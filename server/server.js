var Tables = new Mongo.Collection("tables");

Meteor.startup(function() {
});

Meteor.methods({
	addBills: function(bills) {
		var _id = new Mongo.ObjectID(bills._id);
		bills[bills.name] = bills.bills;
		delete bills._id;
		delete bills.name;
		Tables.update(_id, {$set: bills});
	},
	
	create: function(table) {return Tables.insert({table: table.table, name: table.name});}
});

