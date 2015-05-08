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

Template.addBills.events({
	"click paper-icon-button": function(element) {
		if (element.target.id.search("add") >= 0) {
			document.getElementById(element.target.id.slice(3)).value++;
			addBillsTotal();
		}
		else if (element.target.id.search("remove") >= 0) {
			console.log(element.target.id.slice(6));
			var inputElement = document.getElementById(element.target.id.slice(6));
			if (inputElement.value > 0) {
				inputElement.value--;
				addBillsTotal();
			}
		}
	}
});

var addBillsTotal = function() {
	var total = 0, denominations = ["0.01", "0.05", "0.10", "0.25", "0.50", "1", "2", "5", "10", "20", "50", "100"];
	for (var i = 0; i < denominations.length; i++) {total += Number(document.getElementById(denominations[i]).value * Number(denominations[i]));}
	var totalElement = document.getElementById("total");
	while (totalElement.firstChild) {totalElement.removeChild(totalElement.firstChild);}
	totalElement.appendChild(document.createTextNode(total.toFixed(2)));
};
	
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
    //first run-through: greedy algorithm
    Object.keys(denominations)
	.sort(function(a,b){return b-a;})
	.forEach(function(denomination){
     	    
	    //for (denomination in denominations){ //go through cash high-low
	    
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
	})
    //there's some change left over
    
    var leftover = _.reduce(checks, function(memo, num){return memo+num}, 0);
    console.log("leftover:", leftover);
    
    Object.keys(denominations)
	.sort()
	.forEach(function(denomination){
	    if (denominations[denomination] >= leftover){ //bill can pay off the change
		//how the fuck is this going to work
	    }
	    
	    console.log(checks);
	    console.log(denominations);
	});
};

payBills(tableData);
