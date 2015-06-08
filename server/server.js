Meteor.startup(function() {
});

Meteor.methods({
	create: function(table) {
		var _id = Tables.insert({tableData: table.tableData, name: table.tableName});
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
	},

	join: function(name, id){
        console.log("...");
        console.log(init_person(name));
        var _id = Tables.update(
            {"_id": id},
            {$addToSet:{
                "tableData": init_person(name)
            }

            })

    }
});

