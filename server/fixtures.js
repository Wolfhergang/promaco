//yes! admin
if (Meteor.users.find({username: "admin"}).count() == 0) {
	var adminId = Accounts.createUser({username: "admin", password: "admin"});
	Roles.addUsersToRoles(adminId, ['admin']);	
}

//defaulting user roles
if (Meteor.users.find().count()>0) {
	_.each(Meteor.users.find().fetch(), function(user){
		Roles.addUsersToRoles(user._id, ['user']);
	});
}

Accounts.config({
	forbidClientAccountCreation: true
});