angular.module('checkcontrol')
.config(function($stateProvider) {
	$stateProvider.state('admin', {
		url: '/admin',
		abstract: true,
		templateUrl: 'client/index.html',
		resolve: {
			currentUser: ['$meteor', function($meteor) {
				return $auth.requireValidUser(function(user) {
					return _.contains(user.roles, "admin");
				});
			}]
		}
	})
	.state('admin.index', {
		url: '',
		templateUrl: 'client/admin/admin/index.html',
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
})
.controller('adminIndexCtrl', function($scope, $meteor, $modal, users, Notification){
	$scope.users = users;

	$scope.cambiarPass = function(user){
		$modal.open({
			templateUrl: 'client/modals/changePassword.html'
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
			templateUrl: 'client/modals/confirm.html',
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
})
;