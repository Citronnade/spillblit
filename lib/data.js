//data specification
tableData =
    [
        {
            "name": "bob",
            "bill": 14.34, // the cost of the dinner
            "leftover": 0.00, //in-progress thing?
            "cash":
            {
                "100": 0,
                "50": 0,
                "20": 2,
                "10": 0,
                "5": 0,
                "1": 1,
                "0.25": 0,
                "0.10": 0,
                "0.05": 0,
                "0.01": 0
            },
            "credit": false
        },


        {
            "name": "joe",
            "bill": 18.87,
            "leftover": 0.00, //in-progress thing?
            "cash":
            {
                "100": 0,
                "50": 0,
                "20": 2,
                "10": 3,
                "5": 3,
                "1": 1,
                "0.25": 0,
                "0.10": 0,
                "0.05": 0,
                "0.01": 0
            },
            "credit": true
        },
        {
            "name": "amy",
            "bill": 7.53,
            "leftover": 0.00, //in-progress thing?
            "cash":
            {
                "100": 0,
                "50": 0,
                "20": 1,
                "10": 2,
                "5": 4,
                "1": 4,
                "0.25": 5,
                "0.10": 5,
                "0.05": 0,
                "0.01": 0
            },
            "credit": true
        }
    ];

tables =
{
    "name": "Bob's party",
    "password": "hunter2",
    "tableData": tableData
};

console.log("???");
console.log(tables);
console.log(tableData);




//return (2nd type) data specification  (if we are doing the two column table meaning, the one that avoids returning negative numbers)
//numbers in this data are just arbitrary numbers
resultsData=[ 
    {
	"name":"bob",
        "bill": 14.34, // the cost of the dinner
        //"leftover": 0.00, //in-progress thing?
	"put":
        {
            "100": 1,
            "50": 0,
            "20": 1,
            "10": 0,
            "5": 0,
            "1": 1,
            "0.25": 2,
            "0.10": 0,
            "0.05": 0,
            "0.01": 0
        },
	"take":
        {
            "100": 0,
            "50": 0,
            "20": 2,
            "10": 0,
            "5": 0,
            "1": 1,
            "0.25": 0,
            "0.10": 0,
            "0.05": 1,
            "0.01": 3
        },
        "credit": false
    },
    {
	"name":"bob",
        "bill": 14.34, // the cost of the dinner
        //"leftover": 0.00, //in-progress thing?
	"put":
        {
            "100": 3,
            "50": 0,
            "20": 6,
            "10": 2,
            "5": 0,
            "1": 1,
            "0.25": 2,
            "0.10": 0,
            "0.05": 0,
            "0.01": 0
        },
	"take":
        {
            "100": 0,
            "50": 0,
            "20": 3,
            "10": 1,
            "5": 0,
            "1": 4,
            "0.25": 0,
            "0.10": 0,
            "0.05": 1,
            "0.01": 3
        },
        "credit": false
    },
    
]


