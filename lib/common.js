Tables = new Mongo.Collection("tables");


init_person = function(name){
    console.log(name);
    return {
        "name": name,
        "bill": 0,
        "cash":
        {
            "100": 0,
            "50": 0,
            "20": 0,
            "10": 0,
            "5": 0,
            "1": 0,
            "0,25": 0,
            "0,10": 0,
            "0,05": 0,
            "0,01": 0
        }
    };

};

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

    },
    update: function(name, id, denomination, value) {
        denomination = denomination.replace(".", ",");
        var field = "tableData.$.cash." + denomination;
        //console.log("field", field);
        var set = {
            field: {}
        };
        set[field] = parseInt(value);
        console.log("set", set);
        var _id = Tables.update(
            {"_id": id, "tableData.name": name},
            {
                $set: set
            },

            function (err, no) {
                if (err) {
                    console.log("err", err);
                }
                console.log("no", no);
            }
        );
        console.log(Tables.find().fetch().slice(-1)[0].tableData);
        console.log("_id", _id);
        return _id;
    },

    updateCheck: function(name, id, value){
        var field = "tableData.$.bill";
        var set = {

        };
        console.log("value", value);
        set[field] = parseFloat(value);
        console.log("set", set);
        var _id = Tables.update(
            {"_id": id, "tableData.name": name},
            {
                $set: set
            }
        );

        console.log(Tables.find().fetch().slice(-1)[0].tableData);
        return _id;
    },
/*
    getPerson: function(id, name){
        return Tables.find({"_id": id, "name": name});
    }
    */


});
