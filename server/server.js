Meteor.startup(function() {
});


Meteor.publish("Tables", function(id){
    return Tables.find({"_id": id});
});