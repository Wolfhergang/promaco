Meteor.publish("cheques", function(fechaInicio, fechaFinal){
	if (fechaInicio && fechaFinal) {
		fechaInicio = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate());
		fechaFinal = new Date(fechaFinal.getFullYear(), fechaFinal.getMonth(), fechaFinal.getDate());

		return Cheques.find({
			"userId": this.userId, 
			$or: [
				{
					fechaPago: {$gte: fechaInicio, $lte: fechaFinal},
				},
				{pagado: false}
			]
		});
	}
});

Meteor.publish('users', function() {
	if (Roles.userIsInRole(this.userId, 'admin')) {
		return Meteor.users.find();
	}
});

Meteor.publish('proveedores', function(){
	return Proveedores.find();
});