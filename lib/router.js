Router.configure({
	layoutTemplate: "layout",
	loadingTemplate: "loading",
	notFoundTemplate: "notFound"
});

Router.route("/cheques/nuevo", {
  name: "chequeNuevo"
});
Router.route('/cheques/:_id', {
	name: 'chequeEditar',
	waitOn: function(){
		return Meteor.subscribe("cheques", Meteor.userId());
	},
	data: function() { return Cheques.findOne(this.params._id); }
});
Router.route("/", {
	name: "chequesList",
	waitOn: function(){
		return Meteor.subscribe("cheques", Meteor.userId());
	}
});

var requireLogin = function() {
	if (! Meteor.user()) {
		this.render('accessDenied');
	} else {
		this.next();
	}
}

Router.onBeforeAction(requireLogin);