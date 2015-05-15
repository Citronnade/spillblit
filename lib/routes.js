Router.configure({layoutTemplate: "layout"});
Router.route("/", {action: function() {this.render("hello");}});
Router.route("/addBills", {action: function() {this.render("addBills");}});
Router.route("/create", {action: function() {this.render("createForm");}});
Router.route("/join", {action: function() {this.render("joinForm");}});
