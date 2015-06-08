Tables = new Mongo.Collection("tables");


init_person = function(name){
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