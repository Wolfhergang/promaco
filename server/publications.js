Meteor.publish("cheques", function(userId){
	return Cheques.find({"userId": userId});
});