Cheques = new Mongo.Collection("cheques");

Cheques.allow({
	insert: function (userId, doc) {
		return !! userId;
	}
});

ChequeSchema = new SimpleSchema({
	fechaPago:{
		type: Date
	},

	fechaRegistro:{
		type: Date
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
		type: Number
	}
});

if (Meteor.isServer) {
	Meteor.methods({
		"cheque.pagado": function (_id){
			cheque = Cheques.findOne({_id: _id});
			Cheques.update({_id: _id}, {$set: {"pagado": !cheque.pagado}});
		}
	});
}