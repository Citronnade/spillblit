var denominations = ["0.01", "0.05", "0.10", "0.25", "0.50", "1", "2", "5", "10", "20", "50", "100"];
/*
EUR = [["0.01", "0.02", "0.05", "0.10", "0.20", "0.50", "1", "2"], ["5", "10", "20", "50", "100", "200", "500"]]
JPY = [["1", "5", "10", "50", "100", "500"], ["1000", "2000", "5000", "10000"]];
*/

for (var i = 0; i < denominations.length; i++) {
	document.getElementById("add" + denominations[i]).addEventListener("click", function() {
		document.getElementById(this.id.slice(3)).value++;
		total();
	});
	document.getElementById("remove" + denominations[i]).addEventListener("click", function() {
		var inputElement = document.getElementById(this.id.slice(6));
		if (inputElement.value > 0) {
			inputElement.value--;
			total();
		}
	});
}

var total = function() {
	var total = 0;
	for (var i = 0; i < denominations.length; i++) {total += Number(document.getElementById(denominations[i]).value * Number(denominations[i]));}
	var totalElement = document.getElementById("total");
	while (totalElement.firstChild) {totalElement.removeChild(totalElement.firstChild);}
	totalElement.appendChild(document.createTextNode(total.toFixed(2)));
};

document.getElementById("reset").addEventListener("click", function() {
	for (var i = 0; i < denominations.length; i++) {document.getElementById(denominations[i]).value = 0;}
	total();
});
