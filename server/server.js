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
	
	addTable: function(table) {return Tables.insert({name: table.first + " " + table.last, table: table.table});}
});

