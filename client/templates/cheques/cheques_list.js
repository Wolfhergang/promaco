Template.chequesList.created = function() {
    this.invert = new ReactiveVar(1);
    this.filter = new ReactiveVar({"pagado": 1, "fechaPago": 1});
};

Template.chequesList.helpers({
	cheques: function () {
		var or = Template.instance().filter.get();
		return Cheques.find({},{sort : or});
	}
});

Template.chequesList.onRendered(function (){
	var monto = 0,
		disponible = parseFloat($("#monto").val());
	$(".pago-vencido").each(function (index){
		monto = monto + parseFloat(this.innerHTML);
	});
	$("#acubrir").text((monto-disponible).toFixed(2));
	$(".pago-por-vencer").each(function (index){
		monto = monto + parseFloat(this.innerHTML);
	});
	$("#acubrirm").text((monto-disponible).toFixed(2));
	$('#monto').keyup(function() { 
		calcularMontos();
	});
});

Template.chequesList.events({
	'change #ordenar': function (e, tmplt) {
		e.preventDefault();
		var selFilter = $("#ordenar :selected").text(),
			inv = tmplt.invert.get();
		if (selFilter == "Fecha De Pago") {
			tmplt.filter.set({"fechaPago": inv});
		}else if (selFilter == "Monto") {
			tmplt.filter.set({"monto": inv});
		} else if (selFilter == "No pagados"){
			tmplt.filter.set({"pagado": inv, "fechaPago": 1});
		} else {
			tmplt.filter.set({"numero": inv});
		}
	},
	'change #invertir': function (e, tmplt){
		e.preventDefault();
		if (tmplt.invert.get() == 1) {
			tmplt.invert.set(-1);
		}else{
			tmplt.invert.set(1);
		}
	}
});

function calcularMontos(){
	var monto = 0,
		disponible = parseFloat($("#monto").val());
	if (disponible<1 || !parseFloat(disponible)) {
		disponible = 0;
	}
	$(".pago-vencido").each(function (index){
		monto = monto + parseFloat(this.innerHTML);
	});
	$("#acubrir").text((monto-disponible).toFixed(2));
	$(".pago-por-vencer").each(function (index){
		monto = monto + parseFloat(this.innerHTML);
	});
	$("#acubrirm").text((monto-disponible).toFixed(2));
};
 