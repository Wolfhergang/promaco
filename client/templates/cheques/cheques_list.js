Template.chequesList.helpers({
	cheques: function () {
		return Cheques.find({},{sort: {numero: 1}});
	}
});