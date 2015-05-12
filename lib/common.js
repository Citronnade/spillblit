Tables = new Mongo.Collection("tables");

Meteor.methods({
	addBills: function(bills) {
		console.log(bills);
	}, 
	
    addTable: function(table){
	console.log(table);
	//Tables.update({,
	//});
    }
});
