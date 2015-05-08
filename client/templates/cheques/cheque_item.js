Template.chequeItem.helpers({
	isPagado: function () {
		if (this.pagado) {
			return "si-pagado";
		}
	},
	pagarseHoy: function (){
		var hoy = new Date();
		hoy = hoy.toLocaleFormat('%d/%m/%Y');
		if (this.fechaPago <= hoy  && !this.pagado) {
			return "hoy";
		}
	}
});

Template.chequeItem.events({
	'click .pagado': function (e) {
		if (confirm("¿Quiere cambiar el estado de pago?")){
			Meteor.call("cheque.pagado", this._id);
		}
	}
});