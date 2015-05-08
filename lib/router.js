Router.configure({
	layoutTemplate: "layout",
	loadingTemplate: "loading",
	notFoundTemplate: "notFound"
});

Router.route("/", {
	name: "chequesList",
	waitOn: function(){
		return Meteor.subscribe("cheques", Meteor.userId());
	}
});
Router.route("/cheques/nuevo", {name: "chequeNuevo"});

var requireLogin = function() {
	if (! Meteor.user()) {
		this.render('accessDenied');
	} else {
		this.next();
	}
}

Router.onBeforeAction(requireLogin, {only: "chequesList"});