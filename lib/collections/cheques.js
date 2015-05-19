Cheques = new Mongo.Collection("cheques");

ChequeSchema = new SimpleSchema({
	fechaPago:{
		type: String
	},

	fechaRegistro:{
		type: String
	},

	monto:{
		type: Number,
		decimal: true,
		min: 0
	},

	pagado:{
		type: Boolean
	},

	proveedor:{
		type: String
	},

	numero:{
		type: String
	}
});

if (Meteor.isServer) {
	Meteor.methods({
		"cheque.nuevo": function (cheque){
			check(Meteor.userId(), String);
			if (!Meteor.user()) {
				throw new Meteor.Error(401, 'Authentication required');
			}
		var user = Meteor.user(),
			cheq = _.extend(cheque, {
				userId: user._id,
			}),
			idCheque = Cheques.insert(cheq);

			return {_id: idCheque};
		},
		"cheque.pagado": function (_id){
			if (!Meteor.user()) {
				throw new Meteor.Error(401, 'Authentication required');
			}
			cheque = Cheques.findOne({_id: _id});
			Cheques.update({_id: _id}, {$set: {"pagado": !cheque.pagado}});
		},
		"cheque.eliminar": function (_id){
			if (!Meteor.user()) {
				throw new Meteor.Error(401, 'Authentication required');
			}
			Cheques.remove(_id);
		}
	});
}