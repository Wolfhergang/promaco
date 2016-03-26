angular.module('checkcontrol')
.config(function($stateProvider) {
	$stateProvider.state('login', {
		abstract: true,
		url: '',
		template: '<div ui-view></div>',
		resolve: {
			currentUser: function($auth) {
				return $auth.waitForUser();
			}
		}
	})
	.state('login.login', {
		url: '/',
		templateUrl: 'client/login/login.html',
		controller: 'Login.LoginCtrl'
	})
	.state('login.register', {
		url: '/register',
		templateUrl: 'client/login/register.html',
		controller: 'Login.RegisterCtrl'
	});
})
.controller('Login.LoginCtrl', function($scope, $state, currentUser, Notification) {
	if(currentUser) {
		Notification.success("logueado como " + currentUser.username);
		if (_.contains(currentUser.roles, 'admin')){
			$state.go('admin.index');
		}else{
			$state.go('user.index');		
		}
	}

	$scope.username = '';
	$scope.password = '';
	$scope.currentUser = currentUser;

	$scope.login = function() {
		Meteor.loginWithPassword($scope.username, $scope.password, (error) => {
			if (error) {
				Notification.error(error.reason);
				console.error(error);
				return;
			}

			Notification.success("Bienvenido " + $scope.username);
			if (_.contains(Meteor.user().roles, 'admin')){
				$state.go('admin.index');
			}else{
				$state.go('user.index');
			}
		});
	};
})
.controller('Login.RegisterCtrl', function($scope, $state, $meteor, currentUser, Notification) {
	if(currentUser) {
		Notification.success("logueado como " + currentUser.username);
		if (_.contains(currentUser.roles, 'admin')){
			$state.go('admin.index');
		} 
		$state.go('user.index');
	}

	$scope.user = {};

	$scope.register = function() {
		if ($scope.form.$invalid) return;

		Meteor.call('login.register', $scope.user, (error, result) => {
			if (error) {
				Notification.error(error.reason);
				console.error(error);
				return;
			}

			console.log(result);
			Meteor.loginWithPassword($scope.user.username, $scope.user.password, () => {
				$state.go('user.index');			
			});
		});
	};
})
;
