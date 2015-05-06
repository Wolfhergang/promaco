Template.chequeNuevo.helpers({
	hoy: function () {
		var hoy = new Date();
		hoy = hoy.toLocaleFormat('%d/%m/%Y');
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

		var hoy = new Date().toLocaleFormat('%d/%m/%Y'),
			formul = form.target,
			cheque = {
				fechaPago : formul.fechaPago.value,
				fechaRegistro : hoy,
				monto : formul.monto.value,
				pagado : false,
				proveedor : formul.proveedor.value,
				numero :formul.numero.value 
			};

		cheque._id = Cheques.insert(cheque);
		Router.go("chequesList");
	}
});