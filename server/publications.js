Meteor.publish("cheques", function(){
	return Cheques.find({"userId": this.userId});
});

Meteor.publish('users', function() {
	if (Roles.userIsInRole(this.userId, 'admin')) {
		return Meteor.users.find();
	}
});

Meteor.publish('cheques-search', function(query){
	if (!this.userId) return;
	query = query || {};
	query = _.extend({"userId": this.userId}, query);
	return Cheques.find(query);
});

Meteor.publish('proveedores', function(){
	return Proveedores.find();
});