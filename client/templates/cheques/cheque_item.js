Template.chequeItem.helpers({
	isPagado: function () {
		if (this.pagado) {
			return "si-pagado";
		}
	},
	pagarseHoy: function (){
		var hoy = new Date();
		fecha_split = this.fechaPago.split("/");
		fechaC = new Date(fecha_split[2], parseInt(fecha_split[1])-1, fecha_split[0]);
		if (fechaC <= hoy  && !this.pagado) {
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

formatFecha = function(fecha){
	var dia = fecha.getDate(),
		mes = fecha.getMonth(),
		año = fecha.getFullYear();
		if (mes<10) {
			mes="0"+mes;
		}
		fechaC = dia+"/"+mes+"/"+año;
		return fechaC;
}