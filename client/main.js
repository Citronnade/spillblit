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
			var inputElement = document.getElementById(element.target.id.slice(6));
			if (inputElement.value > 0) {
				inputElement.value--;
				addBillsTotal();
			}
		}
	}, 
	
	"click #submit": function() {
		var bills = {_id: _id, name: "Unnamed person", bills: {}}, denominations = ["0.01", "0.05", "0.10", "0.25", "0.50", "1", "2", "5", "10", "20", "50", "100"];
		for (var i = 0; i < denominations.length; i++) {bills.bills[denominations[i]] = document.getElementById(denominations[i]).value;}
		Meteor.call("addBills", bills);
	}
});


var addBillsTotal = function() {
	var total = 0, denominations = ["0.01", "0.05", "0.10", "0.25", "0.50", "1", "2", "5", "10", "20", "50", "100"];
	for (var i = 0; i < denominations.length; i++) {total += Number(document.getElementById(denominations[i]).value * Number(denominations[i]));}
	var totalElement = document.getElementById("total");
	while (totalElement.firstChild) {totalElement.removeChild(totalElement.firstChild);}
	totalElement.appendChild(document.createTextNode(total.toFixed(2)));
};

var _id; //Used to uniquely identify the Mongo document
Template.createForm.events({
	"click paper-button": function() {
		Meteor.call("addTable", {first: $("#first").value, last: $("#last").value, table: $("table").value}, function(error, result) {
			if (error) {console.log("Error: " + error);}
			else {_id = result;}
			console.log(_id);
		});
	}
});

Template.joinForm.events({
    'click paper-button': function(){
        var fname = $("#first").val();
        var lname = $("#last").val();
        var table = $("#table").val();

        var data = {'fname': fname, 'lname': lname, 'table': table};
        console.log(data);
    }

});

var getBills = function(tData){ //a function that calls a function. oh boy.
    console.log("tData inside getBills", tData);
    var totalBills = _.reduce(tData, function(memo, person){
        memo["100"]+=person.cash["100"];
        memo["50"]+=person.cash["50"];
        memo["20"]+=person.cash["20"];
        memo["10"]+=person.cash["10"];
        memo["5"]+=person.cash["5"];
        memo["1"]+=person.cash["1"];
        memo["0.25"]+=person.cash["0.25"];
        memo["0.10"]+=person.cash["0.10"];
        memo["0.05"]+=person.cash["0.05"];
        memo["0.01"]+=person.cash["0.01"]
        return memo;

    }, {
        "100": 0,
        "50": 0,
        "20": 0,
        "10": 0,
        "5": 0,
        "1": 0,
        "0.25": 0,
        "0.10": 0,
        "0.05": 0,
        "0.01": 0

    });


    return totalBills;

};

var subtractNote = function(wallet, note) {
    wallet[note.toString()]--;
    return wallet;
}

var clear_wallet = function(wallet){
    return _.reduce(wallet, function(memo, value, note){
        memo[note] = 0;
        return memo;
    }, {});

};

console.log("tableData before getBills", tableData);
console.log(getBills(tableData));
console.log("tableData after getBills", tableData);

var add_wallets = function(wallet1, wallet2) { //this adds together 2 "wallets" of bills
    var new_wallet = _.reduce(wallet1, function(memo, value, denomination){
        memo[denomination] = wallet1[denomination] + wallet2[denomination];
        return memo;
    }, {});
    return new_wallet;

};

var get_change = function(excess, denominations) {
    excess = excess * -1; //just easier to work with
    excess = excess.toFixed(2); //should be doing this a LOT more
    console.log("excess", excess);
    denominations = Object.keys(denominations).sort(function(a,b){return parseFloat(b)-parseFloat(a);});

    var bill_list = _.reduce(denominations, function(memo, key){ //PUT THIS SOMEHWERE ELSE OH MY GOD WE NEED THIS SO BADLY
        memo[key] = 0;
        return memo;
    },{});

    console.log("bill_list", bill_list);

    var bills_returned = _.reduce(denominations, function(memo, key){
        key = parseFloat(key); //key is a string...
        if (key < 1){ //fix for 0.1 vs 0.10 duplicates
            key = key.toFixed(2);
        }
        while (key <= excess){ //can pay back change
            memo[key]++;
            excess-=key;
            excess = excess.toFixed(2);
        }
        return memo;
    }, bill_list);
    console.log("bills_returned", bills_returned);
    return bills_returned;

}; //yay change!
var wallet_to_cash = function(wallet_in){
    //Object.keys(wallet_in).reduce(function(sum, key){
    console.log("wallet_in:", wallet_in);
    return _.reduce(Object.keys(wallet_in), function(sum, key){
      console.log("sum", sum);
      console.log("key", key);
      console.log("wallet_in[%s]", key, wallet_in[key]);
      return parseFloat(sum) + wallet_in[key] * parseFloat(key);
  }, 0);

};
var payBills = function(tData){ //assigns bills to everybody
    var tax_percent = 0.08; //this hsould be a param or something
    var tip_percent = 0.15;
    var total_bills = getBills(tableData);
    console.log("tData", tData);
    console.log("total_bills", total_bills);
    var all_checks = _.pluck(tData, 'bill');
    var orig_all_checks = all_checks.slice();
    var all_wallets = _.pluck(tData, 'cash');
    var total_cash;


    console.log("orig total_cash", all_wallets);
    total_cash =
        _.reduce(all_wallets, function(memo, wallet){
            var wallet_contents =  wallet_to_cash(wallet);
            memo.push(wallet_contents);
            return memo;
        }, []);
    var orig_total_cash = total_cash.slice();
    console.log("total_cash", total_cash);
    console.log("all_checks", all_checks);
    console.log("total_bills", total_bills);
    //first run-through: greedy algorithm

    var all_checks_taxed;
    all_checks_taxed = _.reduce(all_checks, function(memo, balance){
        memo.push(parseFloat((balance * (1 + tax_percent)).toFixed(2)));
        console.log("memo", memo);
        return memo;
    },[]);
    console.log("all_checks_taxed", all_checks_taxed);

    var all_checks_taxed_tipped; //we pay based off this
    all_checks_taxed_tipped = _.reduce(all_checks, function(memo, balance){
        memo.push(parseFloat((balance * (1 + tip_percent + tax_percent)).toFixed(2)));
        return memo;
    }, []);
    console.log("all_checks_taxed_tipped:", all_checks_taxed_tipped);
//
    var orig_all_checks_taxed = all_checks_taxed.slice();
    var orig_all_checks_taxed_tipped = all_checks_taxed_tipped.slice();

    Object.keys(total_bills) //pay the bills
        .sort(function(a,b){return parseFloat(b)-parseFloat(a);})
        .forEach(function(denomination){

            //for (denomination in total_bills){ //go through cash high-low

            console.log(denomination);
            while(total_bills[denomination] > 0){ //apply cash greedily
                var empty = 0;
                for (j=0; j < all_checks_taxed.length; j++){  //go through all_checks_taxed_

                    console.log(all_checks_taxed[j]);
                    if (total_bills[denomination] > 0 && denomination < all_checks_taxed[j]){
                        total_bills[denomination]--;
                        all_checks_taxed[j]-=denomination;
                        total_cash[j]-=denomination;
                        total_cash[j] = parseFloat((total_cash[j]).toFixed(2));
                        all_checks_taxed[j] = parseFloat((all_checks_taxed[j]).toFixed(2));
                        //subtractNote(all_wallets[j], denomination);
                        console.log("total_bills", total_bills);
                        console.log("current bill:", denomination);
                        console.log("all_wallets[%d]", j, all_wallets[j]);
                    }
                    else{ //remainder too small for current bill
                        empty++;
                    }
                }
                if(_.every(all_checks_taxed, function(check){return denomination > check;})){break;}
                //if(empty == all_checks_taxed.length){break;} //break from loop if higher

            }
        });

    //there's some change left over
    console.log("all_wallets final:", all_wallets);
    console.log("total_cash final", total_cash);
    console.log("orig_total_cash", orig_total_cash);
    console.log("all_checks_taxed", all_checks_taxed);
    console.log("sum of total_bills:", wallet_to_cash(total_bills));
    var leftover = _.reduce(all_checks_taxed, function(memo, num){return memo+num}, 0); //direct  the bill

    console.log("leftover:", leftover);
    var amt_owed = [];
    for(i =0; i < total_cash.length; i++){
        //amt_owed.push((orig_total_cash[i]-total_cash[i])-orig_all_checks[i]);
        //use the first one and just stop negative bills
        amt_owed.push(parseFloat((orig_total_cash[i]-orig_all_checks_taxed[i]).toFixed(2)));
    }

    var tip_owed = [];
    for(i=0; i < total_cash.length; i++){
        tip_owed.push(parseFloat((orig_all_checks_taxed_tipped[i]-orig_all_checks_taxed[i]).toFixed(2)));
    }
    var total_tip_owed = _.reduce(tip_owed, function(memo, tip){
        memo+=tip;
        return memo;
    },0);

    console.log("orig_all_checks_taxed", orig_all_checks_taxed);
    console.log("amt_owed", amt_owed);
    console.log("tip_owed", tip_owed);
    console.log("total_bills", total_bills);
//total_bills right now is the final pool of bills on the table

    var amt_returned = [];
    var done = false;
//
    //this handles the leftovers
    Object.keys(total_bills)
        .sort(function(a,b){return parseFloat(a)-parseFloat(b);}) //we got low->high here since we only want to use ONE bill
        .forEach(function(denomination) {
            var oldd = denomination;
            denomination = parseFloat(denomination);

            console.log(denomination);

            if (!done) { //you can't break out of a forEach

                while (total_bills[oldd] > 0) { //apply cash greedily
                    var empty=0;
                    console.log("leftover", leftover);
                    console.log("total_bills[%s]", oldd, total_bills[oldd]);

                    for (j = 0; j < amt_owed.length; j++) {  //go through balance
                        if (all_wallets[j][oldd] > 0 && denomination >= leftover) {
                            //we're nuking the leftover with a single bill now
                            console.log("denomination used to nuke:", denomination);
                            total_bills[oldd]--;
                            leftover-=denomination;
                            done = true;
                            break; //this will be guaranteed to nuke the whole thing
                        }
                        else{
                            empty++;

                        }
                    }
                    if(empty == amt_owed.length){break;}
                    console.log("denomination", denomination);
                    console.log("leftover", leftover);
                    /*if(_.every(amt_owed, function(balance){return denomination > balance;})){
                 console.log("breaking due to none left")
                        break;}
*/
                    if(done){break;}
                    console.log("done", done);

                }
            }
        });

    //we need to get some change
    var change = get_change(leftover, total_bills);
    total_bills = add_wallets(total_bills, change);

    console.log("total_bills final", total_bills);
    console.log("amt_owed", amt_owed);

    var bills_returned = _.pluck(tData, "cash"); //here we get everyone's bills
    bills_returned = JSON.parse(JSON.stringify(bills_returned)); //WHAT THE HELL JAVASCRIPT
    console.log("bills returned after plucking:", bills_returned);
    bills_returned.forEach(function(wallet) {
        _.each(wallet, function(value, denomination){
            wallet[denomination] = 0;
        });

    });
    console.log("bills returned:", bills_returned);


    /*var bill_list = _.reduce(denominations, function(memo, key){ //PUT THIS SOMEHWERE ELSE OH MY GOD WE NEED THIS SO BADLY
        memo[key] = 0;
        return memo;
    },{});
*/

    console.log("total_bills before returning change:", total_bills);
    Object.keys(total_bills)//return change to everybody.  HOPEFULLY THIS WORKS
        .sort(function(a,b){return parseFloat(b)-parseFloat(a);})
        .forEach(function(denomination){

            //for (denomination in total_bills){ //go through cash high-low

            console.log("demonination", denomination);
            while(total_bills[denomination] > 0){ //apply cash greedily
                var empty = 0;
                for (j=0; j < amt_owed.length; j++){  //go through what everyone's owed

                    console.log("amt_owed[%d] 1 ", j, amt_owed[j]);
                    if (total_bills[denomination] > 0 && denomination <= amt_owed[j]){
                        total_bills[denomination]--;
                        amt_owed[j]-=denomination;
                        total_cash[j]-=denomination;
                        bills_returned[j][denomination]++;
                        total_cash[j] = parseFloat((total_cash[j]).toFixed(2));
                        amt_owed[j] = parseFloat((amt_owed[j]).toFixed(2));
                        console.log("total_bills", total_bills);
                        console.log("current bill:", denomination);
                        console.log("amt_owed[%d] 2 ", j, amt_owed[j]);
                        console.log("bills_returned", bills_returned)
                    }
                    else{ //remainder too small for current bill
                        empty++;
                    }
                }
                if(_.every(amt_owed, function(check){return denomination > check;})){break;}

            }
        });
    var i = amt_owed.indexOf(Math.max.apply(Math, amt_owed)); //this finds the guy who owes the most money
    console.log("bills_returned[%d] before:", i, bills_returned[i]);
    bills_returned[i] = add_wallets(bills_returned[i], total_bills); //dump all remaining money onto that guy
    console.log("bills_returned[%d] after:", i, bills_returned[i]);
    //this is to prep for debt equalization later

    console.log("total_bills", total_bills);
    amt_owed[i]-=wallet_to_cash(total_bills);
    console.log("total_cash", total_cash);
    //total_cash = 0;

    console.log("bills_returned", bills_returned);
    console.log("amt_owed", amt_owed); //this is now mostly useless besid
    // es telling them that there's
    // not enough bills to completley work it out
    total_bills = clear_wallet(total_bills);
    console.log("cleared total_bills", total_bills);
    _.each(bills_returned, function(wallet){
        total_bills = add_wallets(total_bills, wallet);
    });
    console.log("total_bills after change:", total_bills);
    console.log("tip owed", tip_owed);

    //okay...we'll have to write a custom function for tip.


    console.log("total_bills after tip:", total_bills);
    console.log("tip_owed final:", tip_owed);

    var borrowers = [];
    var lenders = [];
    _.each(bills_returned, function(wallet, index){
        console.log("wallet", wallet);
        console.log("index", index);
        if (amt_owed[index] >= 0){ //owed money
            lenders.push({"wallet": wallet, "oindex":index, "sum": wallet_to_cash(wallet)});
        }
        else{
            borrowers.push({"wallet": wallet, "oindex":index, "sum": wallet_to_cash(wallet)});
        }
    });
    console.log("borrowers", borrowers);
    console.log("lenders", lenders);
    borrowers = borrowers.sort(function(a, b){return amt_owed[b["oindex"]]- amt_owed[a["oindex"]]});
    lenders = lenders.sort(function(a,b){return amt_owed[a["oindex"]]- amt_owed[b["oindex"]]});
    console.log("borrowers", borrowers);
    console.log("lenders", lenders);


    _.each(borrowers, function(person){
        var wallet = person["wallet"];
        _.each(_.keys(wallet).sort(function(a, b){return b-a;}), function(denomination){
            console.log("denomination", denomination);

            while(wallet[denomination] > 0) { //while we have bills
                if (parseFloat(denomination) < amt_owed[lenders[0]["oindex"]]) {
                    console.log("amt_owed[lenders[0]['oindex']]", amt_owed[lenders[0]["oindex"]]);
                    console.log("amt_owed[person['oindex']]", amt_owed[person['oindex']]);
                    console.log("parsed denomination", parseFloat(denomination));
                    amt_owed[lenders[0]["oindex"]] -=parseFloat(denomination);
                    amt_owed[person["oindex"]] +=parseFloat(denomination);
                    amt_owed[lenders[0]["oindex"]] = parseFloat((amt_owed[lenders[0]["oindex"]]).toFixed(2));
                    amt_owed[person["oindex"]] = parseFloat((amt_owed[person["oindex"]]).toFixed(2));

                    wallet[denomination]--;
                    lenders[0].wallet[denomination]++;
                    lenders = lenders.sort(function(a,b){return amt_owed[a["oindex"]]- amt_owed[b["oindex"]]});
                    console.log("subtracted:", denomination);
                }
                else{
                    break;
                }
                lenders = lenders.sort(function(a,b){return amt_owed[a["oindex"]]- amt_owed[b["oindex"]]});
            }
        })
    });
    console.log("amt_owed", amt_owed);

};



payBills(tableData);
