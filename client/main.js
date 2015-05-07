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
    var orig_checks = checks.slice();
    var total_cash = _.pluck(tData, 'cash');
    console.log("total_cash", total_cash);
    total_cash = 
	_.reduce(total_cash, function(memo, wallet){
	    var wallet_contents =  Object.keys(wallet).reduce(function(sum, key){
		return parseFloat(sum) + wallet[key] * parseFloat(key);
	    });
	    memo.push(wallet_contents);
	    return memo;
	}, []);
    
    console.log("total_cash", total_cash);
    console.log("checks", checks)
    var denominations = totalBills;
    console.log("denominations", denominations);
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
		    else{ //remainder too small for current bill
			empty++;
		    }
		}
		if(_.every(checks, function(check){return denomination > check;})){break;}
		//if(empty == checks.length){break;} //break from loop if higher
		
	    }
	});
    //there's some change left over
    
    var leftover = _.reduce(checks, function(memo, num){return memo+num}, 0);
    console.log("leftover:", leftover);
    var amt_owed = [];
    for(i =0; i < total_cash.length; i++){
	amt_owed.push(total_cash[i]-orig_checks[i]);
    }
    console.log("orig_checks", orig_checks);
    console.log("amt_owed", amt_owed);
    
    var amt_returned = [];

    Object.keys(denominations)
	.sort(function(a,b){return b-a;})
	.forEach(function(denomination){
     	    
	    //for (denomination in denominations){ //go through cash high-low
	    
	    console.log(denomination);
	    while(denominations[denomination] > 0){ //apply cash greedily
		var empty = 0;
		for (j=0; j < amt_owed.length; j++){  //go through balances

		    console.log(amt_owed[j]);
		    if (denominations[denomination] > 0 && denomination < amt_owed[j]){
			denominations[denomination]--;
			amt_owed[j]-=denomination;
		    }
		    else{ //remainder too small for current bill
			empty++;
		    }
		}
		if(_.every(amt_owed, function(balance){return denomination > balance;})){break;}
		//if(empty == checks.length){break;} //break from loop if higher
		
	    }
	});
    console.log("denominations final", denominations);
    console.log("amt_owed", amt_owed);
    
};

payBills(tableData);
