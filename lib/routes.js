Router.configure({layoutTemplate: "layout"});
Router.route("/", {action: function() {this.render("home");}});
Router.route("/create", {action: function() {this.render("create");}});
Router.route("/enterBills", {action: function() {this.render("enterBills");}});
Router.route("/join", {action: function() {this.render("join");}});
