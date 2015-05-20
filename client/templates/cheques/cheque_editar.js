Template.chequeEditar.helpers({
	fechaPagoFormateada: function (){
		var fecha = formatFecha(this.fechaPago);
		return fecha;
	}
});

Template.chequeEditar.rendered = function () {
	$('#fechaPago').datepicker({
	    format: "dd/mm/yyyy",
	    language: "es",
	    todayHighlight: true,
	    autoclose: true
	});
};

Template.chequeEditar.events({
	'submit form': function (form, tmplt) {
		form.preventDefault();
		var formul = form.target,
			fp = formul.fechaPago.value.split("/"),
			pagarse = new Date(fp[2],parseInt(fp[1], 10)-1,fp[0]),
			propiedades = {
				fechaPago : pagarse,
				monto : formul.monto.value,
				proveedor : formul.proveedor.value,
				numero :formul.numero.value
			};

		Meteor.call("cheque.editar", this._id, propiedades);
		Router.go("chequesList");
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

function stopRKey(evt) {
  var evt = (evt) ? evt : ((event) ? event : null);
  var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
  if ((evt.keyCode == 13) && (node.type=="text"))  {return false;}
}

document.onkeypress = stopRKey; 