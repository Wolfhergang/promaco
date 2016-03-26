angular.module('checkcontrol')
.directive('header', function() {
	return {
		templateUrl: 'client/_app/directives/header/header.html',
		restrict: 'E',
		replace: true,
		controller: ['$scope', '$meteor', '$modal', '$state', 'Notification', function($scope, $meteor, $modal, $state, Notification) {
			$scope.logout = function(){
				$modal.open({
					templateUrl: 'client/modals/confirm.html',
					controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
						$scope.action = "salir";
					}]
				}).result.then(function() {
					$meteor.logout().then(function(){
						$state.go("login.login");
						Notification.success({message: "Logged out", delay: 2000});
					});
				});
			};
		}]
	};
});
