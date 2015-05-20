Template.chequeItem.helpers({
	isPagado: function () {
		if (this.pagado) {
			return "si-pagado";
		}
	},
	pagarseHoy: function (){
		var hoy = new Date(),
			fechaC = new Date(this.fechaPago);
		if (fechaC <= hoy  && !this.pagado) {
			return "hoy";
		}
	},
	fechaPagoFormateada: function (){
		var fecha = formatFecha(this.fechaPago);
		return fecha;
	},
	pagoVencido: function (){
		var hoy = new Date(),
			tomorrow = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()+1),
			fechaC = new Date(this.fechaPago);
		if (fechaC <= hoy  && !this.pagado) {
			return "pago-vencido";
		}else if (fechaC <= tomorrow  && !this.pagado) {
			return "pago-por-vencer";
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

formatFecha = function(fecha){
	var dia = fecha.getDate(),
		mes = parseInt(fecha.getMonth(), 10) + 1,
		año = fecha.getFullYear();
		if (mes<10) {
			mes="0"+mes;
		}
		fechaC = dia+"/"+mes+"/"+año;
		return fechaC;
}