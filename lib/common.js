Tables = new Mongo.Collection("tables");

Meteor.methods({
    addTable: function(table){
	console.log(table);
	//Tables.update({,
	//});
    }
});
