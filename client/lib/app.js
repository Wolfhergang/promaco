angular.module('checkcontrol', ['angular-meteor', 'angular-meteor.auth', 'ui.router', 'ui.bootstrap', 'ui-notification', 'toggle-switch', 'ngLocale'])
.run( function($rootScope, $meteor, $state) {
	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
		switch(error) {
			case 'AUTH_REQUIRED':
				console.log("AUTH_REQUIRED");
				return $state.go('login.login');
			case 'FORBIDDEN':
				console.log("FORBIDDEN");
				return $state.go('error', {error: error});
			case 'NOT_FOUND':
				console.log("NOT_FOUND");
				return $state.go('error', {error: error});
		}

		if (error) {
			console.error(error);
		}
	//		$state.go('error.500');
	});
})
.config(function($urlRouterProvider, $locationProvider) {
	$urlRouterProvider.otherwise('/');
	$locationProvider.html5Mode(true);
});

function onReady() {
	angular.bootstrap(document, ['checkcontrol']);
}

if(Meteor.isCordova) {
	angular.element(document).on('deviceready', onReady);
} else {
	angular.element(document).ready(onReady);
}
