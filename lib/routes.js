//put some settings into a route controller
//refactor to using contentFor instead of yield so we can pass in data
//jk we can put in data inside the render()

Router.configure({
    layoutTemplate: "layout"
});

Router.route('/', {
    action: function(){
        this.render("home"); //hello is the name of the template in html
        this.render("mainHeader", {to: "header"});
	this.render("mainFooter", {to: "footer"});
    }
});

Router.route('/join', {
    action: function(){
        this.render("joinForm"); //render in the join form template
        this.render("mainHeader", {to: "header"});
	this.render("mainFooter", {to: "footer"});
    }
});

Router.route('/create', {
    action: function(){
        this.render("createForm"); //render in the create form template
        this.render("mainHeader", {to: "header"});
	this.render("mainFooter", {to: "footer"});
    }
});


Router.route("/addbills", {
    action:function(){
        this.render("addBills");
        this.render("mainHeader", {to: "header"});
	this.render("mainFooter", {to: "footer"});
        // we might want to append a status table here
    }
});

Router.route("/results", {
    action:function(){
        this.render("results");
        this.render("mainHeader", {to: "header"});
	this.render("mainFooter", {to: "footer"});
    },
});

Router.route("/table/:name/", {
    action: function(){
        this.render("table");
        this.render("mainHeader", {to: "header"});
	this.render("mainFooter", {to: "footer"});
    }
});
/*
 Router.route(':table',{
 //should we just parse the table name for a password?
 }
 */
