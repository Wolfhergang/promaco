Template.chequesList.created = function() {
    this.invert = new ReactiveVar(1);
    this.filter = new ReactiveVar({"numero": 1});
};

Template.chequesList.helpers({
	cheques: function () {
		var or = Template.instance().filter.get();
		return Cheques.find({},{sort : or});
	}
});

Template.chequesList.events({
	'change #ordenar': function (e, tmplt) {
		e.preventDefault();
		var selFilter = $("#ordenar :selected").text(),
			inv = tmplt.invert.get();
		if (selFilter == "Fecha De Pago") {
			tmplt.filter.set({"fechaPago": inv});
		}else if (selFilter == "Fecha De Registro") {
			tmplt.filter.set({"fechaRegistro": inv});
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