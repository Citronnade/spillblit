// counter starts at 0
Session.setDefault('counter', 0);

Template.hello.helpers({
    counter: function () {
	return Session.get('counter');
    }
});

Template.hello.events({
    'click paper-button': function () {
	Session.set('counter', Session.get('counter') + 1);
    }
});

Template.joinForm.events({
    'click paper-button': function(){
	var fname = $("#first").val();
	var lname = $("#last").val();
	var table = $("#table").val();

	var data = {'fname': fname, 'lname': lname, 'table': table};
	console.log(data);
	Meteor.call("addTable", data);
    }
    
});

var getBills = function(tData){ //a function that calls a function. oh boy.
    var totalBills = _.reduce(tData, function(memo, person){
	memo["100"]+=person.cash["100"];
	memo["50"]+=person.cash["50"];
	memo["20"]+=person.cash["20"];
	memo["10"]+=person.cash["10"];
	memo["5"]+=person.cash["5"];
	memo["2"]+=person.cash["2"];
	memo["1"]+=person.cash["1"];

	return memo;
	
    }, {
	"20": 0,
	"10": 0,
	"5": 0,
	"2": 0,
	"1": 0
    });
    

    return totalBills;

};

//console.log(getBills(tableData));
