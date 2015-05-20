function objectToArray(object) {return _.map(object, function(value, key, list) {return " " + key.replace(",", ".") + ": " + ((typeof value == "object") ? objectToArray(value) : value);});}

Router.configure({layoutTemplate: "layout"});
Router.route("/", {action: function() {this.render("home");}});
Router.route("/create", {action: function() {this.render("create");}});
Router.route("/enterBills", {action: function() {this.render("enterBills");}});
Router.route("/join", {action: function() {this.render("join");}});
Router.route("/results", {action: function() {this.render("results");}});
Router.route("/table/:_id", {action: function() {this.render("table", {data: function() {return objectToArray(Tables.findOne(this.params._id));}});}});

