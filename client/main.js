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
	"100": 0,
	"50": 0,
	"20": 0,
	"10": 0,
	"5": 0,
	"2": 0,
	"1": 0
    });
    

    return totalBills;

};

console.log(getBills(tableData));

var totalBills = getBills(tableData);

var payBills = function(tData){ //assigns bills to everybody
    var checks = _.pluck(tData, 'bill');
    console.log(checks)
    var denominations = totalBills;
    console.log(denominations);
    for (denomination in denominations){ //go through cash high-low
	console.log(denomination);
	while(denominations[denomination] > 0){ //apply cash greedily
	    var empty = 0;
	    for (j=0; j < checks.length; j++){  //go through checks

		console.log(checks[j]);
		if (denominations[denomination] > 0 && denomination < checks[j]){
		    denominations[denomination]--;
		    checks[j]-=denomination;
		}
		else{
		    empty++;
		}
	    }
	    if(empty == checks.length){break;} //break from loop if higher
	    
	}
    }
    
    console.log(checks);
    console.log(denominations);
};

payBills(tableData);
