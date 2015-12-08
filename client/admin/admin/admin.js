angular.module('checkcontrol')
.config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('admin', {
		url: '/admin',
		abstract: true,
		templateUrl: 'client/index.ng.html',
		resolve: {
			currentUser: ['$meteor', function($meteor) {
				return $meteor.requireValidUser(function(user) {
					return _.contains(user.roles, "admin");
				});
			}]
		}
	})
	.state('admin.index', {
		url: '',
		templateUrl: 'client/admin/admin/index.ng.html',
		controller: 'adminIndexCtrl',
		resolve: {
			usersSub: ['$meteor', function($meteor){
				return $meteor.subscribe("users");
			}],
			users: ['$meteor', 'usersSub', function($meteor){
				return $meteor.collection(Meteor.users, false);
			}]
		}
	})
}])
.controller('adminIndexCtrl', ['$scope', '$meteor' ,'$modal', 'users', 'Notification', function($scope, $meteor, $modal, users, Notification){
	$scope.users = users;

	$scope.cambiarPass = function(user){
		$modal.open({
			templateUrl: 'client/modals/changePassword.ng.html'
		}).result.then(function(newPassword) {
			$meteor.call("change-password", user.username, newPassword).then(function(data){
				Notification.success({message: "Password de "+user.username+" cambiado", delay: 2000});
			}, function (error){
				console.log(error);
				Notification.error({message: "Error", delay: 2000});
			});
		});
	};
	
	$scope.borrar = function(user){
		$modal.open({
			templateUrl: 'client/modals/confirm.ng.html',
			controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
				$scope.action = "eliminar este usuario";
			}]
		}).result.then(function() {
			$scope.users.remove(user._id).then(function(data){
				Notification.success({message: "usuario eliminado", delay: 2000});
			}, function (error){
				console.log(error);
				Notification.error({message: "Error", delay: 2000});
			});
		});
   	};
}])
;