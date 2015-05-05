Cheques = new Mongo.Collection("cheques");

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