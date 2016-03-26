RegisterUserSchema = new SimpleSchema({
	username: {
		type: String,
		min: 1
	},
	password: {
		type: String,
		min: 1
	}
});

if (Meteor.isServer) {
	Meteor.users.allow({
		remove: function(userId, doc, fields, modifier) {
			if (Meteor.user() && Roles.userIsInRole(Meteor.userId(), 'admin')) {
				return true;
			}
		}
	});

	Meteor.methods({
		'change-password': function (username, newPassword){
			if (!Meteor.userId()) {
				throw new Meteor.Error(401, "Authentication required");
			}

			if (!_.contains(Meteor.user().roles, "admin")){
				throw new Meteor.Error(403, "Forbidden");
			}

			var user = Meteor.users.findOne({username: username});
			if (!user) {
				throw new Meteor.Error(404, "User not found");	
			}

			Accounts.setPassword(user._id, newPassword);
		},
		'login.register': function(user){
			check(user, RegisterUserSchema);

			var exists = Meteor.users.findOne({username: user.username});

			if (exists) {
				console.log("error");
				throw new Meteor.Error(403, "Este usuario ya existe, seleccione otro nombre");
			}

			var _id = Accounts.createUser({
				username: user.username,
				password: user.password
			});

			Roles.addUsersToRoles(_id, ['user']);
			return _id;
		}
	});
}
