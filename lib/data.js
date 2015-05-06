//data specification
tableData = 
    [
	{
	    "name": "bob",
	    "bill": 20.23, // the cost of the dinner
	    "leftover": 0.00, //in-progress thing?
	    "cash":
	    {
		"100": 0,
		"50": 2,
		"20": 5,
		"10": 5,
		"5": 23,
		"2": 1,
		"1": 0
	    },
	    "credit": false
	},
	
	{
	    "name": "joe",
	    "bill": 14.23,
	    "leftover": 0.00, //in-progress thing?
	    "cash":
	    {
		"100": 1,
		"50": 0,
		"20": 2,
		"10": 5,
		"5": 23,
		"2": 1,
		"1": 0
	   },
	    "credit": true
	},
    ];

tables = 
    {
	"name": "Bob's party",
	"password": "hunter2",
	"tableData": tableData
    };

console.log("???");
console.log(tables);
