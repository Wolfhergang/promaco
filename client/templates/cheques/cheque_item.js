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
		e.preventDefault();
		if (confirm("¿Quiere cambiar el estado de pago?")){
			Meteor.call("cheque.pagado", this._id);
		}
	},
	'click .eliminar': function (e) {
		e.preventDefault();
		if (confirm("¿Seguro que desea eliminar este cheque?")) {
			Meteor.call("cheque.eliminar", this._id);
		}
	}
});