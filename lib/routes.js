Router.configure({layoutTemplate: "layout"});
Router.route("/", {action: function() {this.render("home");}});
Router.route("/create", {action: function() {this.render("create");}});
Router.route("/enterBills", {action: function() {this.render("enterBills");}});
Router.route("/join", {action: function() {this.render("join");}});
Router.route("/table/:_id", {action: function() {
	console.log("asdffdsa");	
	console.log(this.params._id);
	console.log(Tables);
	this.render("table", {data: function() {return Tables.findOne(this.params._id);}});
}});
