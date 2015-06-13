Meteor.startup(function() {
});


Meteor.publish("Tables", function(){
    return Tables.find();
});