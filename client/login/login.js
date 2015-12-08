angular.module('checkcontrol')
.config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('login', {
		abstract: true,
		url: '/login',
		template: '<div ui-view></div>',
		resolve: {
			currentUser: ['$meteor', function($meteor) {
				return $meteor.waitForUser();
			}]
		}
	})
	.state('login.login', {
		url: '',
		templateUrl: 'client/login/login.ng.html',
		controller: 'Login.LoginCtrl'
	})
	.state('login.register', {
		url: '/register',
		templateUrl: 'client/login/register.ng.html',
		controller: 'Login.RegisterCtrl'
	});
}])
.controller('Login.LoginCtrl', ['$scope', '$state', 'currentUser', 'Notification', function($scope, $state, cu, Notification) {
	if(cu) {
		Notification.success("logueado como " + cu.username);
		if (_.contains(cu.roles, 'admin')){
			$state.go('admin.index');
		} 
		$state.go('user.index');		
	}

	$scope.username = '';
	$scope.password = '';
	$scope.cu = cu;

	$scope.login = function() {
		$scope.$meteor.loginWithPassword($scope.username, $scope.password).then(function() {
			Notification.success("logueado como " + $scope.username);
			if (_.contains(Meteor.user().roles, 'admin')){
				$state.go('admin.index');
			}else{
				$state.go('user.index');
			}
		}, function(err) {
			alert(err.reason);
		});
	};
}])
.controller('Login.RegisterCtrl', ['$scope', '$state', 'currentUser', 'Notification', function($scope, $state, cu, Notification) {
	if(cu) {
		Notification.success("logueado como " + cu.username);
		if (_.contains(cu.roles, 'admin')){
			$state.go('admin.index');
		} 
		$state.go('user.index');
	}

	$scope.user = {};

	$scope.register = function() {
		if ($scope.form.$invalid) return;
		$scope.$meteor.call('login.register', $scope.user).then(function() {
			$scope.$meteor.loginWithPassword($scope.user.username, $scope.user.password).then(function() {
				$state.go('user.index');			
			});
		}, function(err) {
			if (err.reason = "Match failed") Notification.error({message: "The passwords dont match"});
			else Notification.error({message: err.reason});
		});
	};
}])
;
