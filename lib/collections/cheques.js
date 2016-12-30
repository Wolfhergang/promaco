Cheques = new Mongo.Collection("cheques");

ChequeSchema = new SimpleSchema({
	fechaPago:{
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
		type: String
	},

	numeroFactura:{
		type: String
	}
});

if (Meteor.isServer) {
	Cheques.before.insert(function(userId, doc) {
		doc.userId = userId;
		doc.pagado = false;
	});

	Cheques.after.insert(function(userId, doc) {
		if(Proveedores.find({nombre: {$regex: doc.proveedor, $options: 'i'}}).count()===0) {
			Proveedores.insert({nombre: doc.proveedor, userId: userId});
		}
	});

	Cheques.after.update(function(userId, doc) {
		if(Proveedores.find({nombre: {$regex: doc.proveedor, $options: 'i'}}).count()===0) {
			Proveedores.insert({nombre: doc.proveedor});
		}
	});

	Cheques.allow({
		insert: function(userId, doc) {
			doc.pagado = false;
			check(doc, ChequeSchema);
			if (Meteor.userId() == userId) {
				return true;
			}
		},
		update: function(userId, doc, fields, modifier) {
			if (_.without(fields, 'fechaPago', 'monto', 'pagado', 'numero', 'numeroFactura', 'proveedor').length>0) return false;
			if (Meteor.userId() == userId) {
				return true;
			}
		},
		remove: function(userId, doc){
			if (Meteor.userId() == userId) {
				return true;
			}
		},
		fetch: ['userId']
	});
}