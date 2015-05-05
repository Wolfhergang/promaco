Template.chequesList.helpers({
	cheques: function () {
		return Cheques.find();
	}
});