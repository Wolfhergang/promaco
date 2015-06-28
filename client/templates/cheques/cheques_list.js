Template.chequesList.created = function() {
    this.mes = new ReactiveVar({});
    this.invert = new ReactiveVar(1);
    this.filter = new ReactiveVar({"pagado": 1, "fechaPago": 1});
    this.search = new ReactiveVar({"proveedor": {$regex: "", $options: 'i'}});
};

Template.chequesList.helpers({
	cheques: function () {
		var or = Template.instance().filter.get(),
			srch = _.extend(Template.instance().search.get(), Template.instance().mes.get());
		return Cheques.find(srch ,{sort : or});
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
	$("#buscar").keyup(function(){
		$("form").delay(200).submit();
	});
});

Template.chequesList.events({
	'change #ordenar': function (e, tmplt) {
		e.preventDefault();
		var selFilter = $("#ordenar :selected").text(),
			inv = tmplt.invert.get();
		if (selFilter == "Fecha De Pago") {
			tmplt.filter.set({"fechaPago": inv});
		}else if (selFilter == "Alfabetico") {
			tmplt.filter.set({"proveedor": inv, "fechaPago": 1});
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
	},
	'submit form': function (e, tmplt){
		e.preventDefault();
		var busqueda = $("#buscar").val();
		tmplt.search.set({"proveedor": {$regex: busqueda, $options: 'i'}});
	},
	'change #year-busqueda, change #mes-inicio select' : function(e, tmplt){
		e.preventDefault();
		var year = parseInt($("#year-busqueda").find(":selected").text()),
			mes	= $("#mes-inicio").find(":selected").index(),
			fechaInicio = new Date(year, mes, 1);
		tmplt.mes.set({"fechaPago": {$gte: fechaInicio}});
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