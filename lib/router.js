Router.configure({
	layoutTemplate: "layout",
	loadingTemplate: "loading",
	notFoundTemplate: "notFound",
	waitOn: function(){
		return Meteor.subscribe("cheques");
	}
});

Router.route("/", {name: "chequesList"});
Router.route("/cheques/nuevo", {name: "chequeNuevo"});

var requireLogin = function() {
	if (! Meteor.user()) {
		this.render('accessDenied');
	} else {
		this.next();
	}
}

Router.onBeforeActi