//put some settings into a route controller
//refactor to using contentFor instead of yield so we can pass in data

Router.configure({
    layoutTemplate: "layout" 
});

Router.route('/', {
    action: function(){
	this.render("hello"); //hello is the name of the template in html
	this.render("mainHeader", {to: "header"});
    }
});

Router.route('/join', {
    action: function(){
	this.render("hello"); //render in the join form template
	this.render("mainHeader", {to: "header"});
    }
});

Router.route('/create', {
    action: function(){
	this.render("hello"); //render in the create form template
	this.render("mainHeader", {to: "header"});
    }
});

Router.route(':table',{
    //should we just parse the table name for a password?
}
