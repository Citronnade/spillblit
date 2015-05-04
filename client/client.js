// counter starts at 0
Session.setDefault('counter', 0);

Template.hello.helpers({
    counter: function () {
	return Session.get('counter');
    }
});

Template.hello.events({
    'click paper-button': function () {
	Session.set('counter', Session.get('counter') + 1);
    }
});

Template.joinForm.events({
    'click paper-button': function(){
	var fname = $("#first").val();
	var lname = $("#last").val();
	var table = $("#table").val();

	var data = {'fname': fname, 'lname': lname, 'table': table};
	console.log(data);
    }
    
});
