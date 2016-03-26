angular.module('checkcontrol')
.config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('error', {
		url: '/error',
		templateUrl: 'client/error/error.html',
		controller: 'ErrorCtrl'
	})
}])
.controller('ErrorCtrl', ['$scope', '$state', function($scope, $state){
	$scope.back = function (){
		$state.go('login.login');
	};
}])
;