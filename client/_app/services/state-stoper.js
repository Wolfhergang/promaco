angular.module('checkcontrol')
.run(['$rootScope', '$state', function($rootScope, $state) {
	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
		toState.$stoppables = [];

		angular.forEach($state.$current.locals.resolve.$$values, function(resolvedValue) {
			if(resolvedValue && resolvedValue.stop) {
				toState.$stoppables.push(resolvedValue);
			}
		});

		if(!fromState.$stoppables) {
			return;
		}

		var stoppable;
		while(stoppable = fromState.$stoppables.shift()) {
			stoppable.stop();
		}
	});
}])
.service('$meteorPromise', ['$meteor', '$q', function($meteor, $q) {
	this.object = function() {
		var obj = $meteor.object.apply(this, Array.prototype.slice.call(arguments));

		if(!obj._id) {
			return $q.reject('NOT_FOUND');
		}

		return obj;
	};
}]);
