Template.chequeNuevo.helpers({
	hoy: function () {
		var hoy = new Date();
		hoy = formatFecha(hoy);
		return hoy;
	}
});

Template.chequeNuevo.rendered = function () {
	$('#fechaPago').datepicker({
	    format: "dd/mm/yyyy",
	    language: "es",
	    todayHighlight: true,
	    autoclose: true
	});
};

Template.chequeNuevo.events({
	'submit form': function (form, tmplt) {
		form.preventDefault();

		var formul = form.target,
			hoy = formatFecha(new Date()),
			cheque = {
				fechaPago : formul.fechaPago.value,
				fechaRegistro : hoy,
				monto : formul.monto.value,
				pagado : false,
				proveedor : formul.proveedor.value,
				numero :formul.numero.value
			};

		Meteor.call("cheque.nuevo", cheque);
		Router.go("chequesList");
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

function stopRKey(evt) {
  var evt = (evt) ? evt : ((event) ? event : null);
  var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
  if ((evt.keyCode == 13) && (node.type=="text"))  {return false;}
}

document.onkeypress = stopRKey; 