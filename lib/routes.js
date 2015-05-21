Router.configure({layoutTemplate: "layout"});
Router.route("/", {action: function() {this.render("home");}});
Router.route("/create", {action: function() {this.render("create");}});
Router.route("/join", {action: function() {this.render("join");}});
Router.route("/results", {action: function() {this.render("results");}});
Router.route("/table/:_id", {action: function() {
	Session.set("_id", this.params._id);
	this.render("table", {data: function() {return this.params._id;}});}
});

