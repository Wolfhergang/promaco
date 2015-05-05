Meteor.publish("cheques", function(){
	return Cheques.find();
});