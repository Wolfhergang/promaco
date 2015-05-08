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

		var formul = form.target,
			hoy = new Date().toLocaleFormat('%d/%m/%Y'),
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