//put some settings into a route controller

Router.configure({
    layoutTemplate: "layout" 
});

Router.route('/', {
    action: function(){
	this.render("hello"); //hello is the name of the template in html
	this.render("mainHeader", {to: "header"});
    }
});
