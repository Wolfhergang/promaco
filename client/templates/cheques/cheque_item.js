Template.chequeItem.helpers({
	isPagado: function (pagado) {
		if (pagado) {
			return true;
		}else{
			return false;
		}
	}
});

Template.chequeItem.events({
	'click .pagado': function (e) {
		Meteor.call("cheque.pagado", this._id);
	}
});