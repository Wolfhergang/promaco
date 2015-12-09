angular.module('checkcontrol')
.config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('user', {
		url: '',
		abstract: true,
		templateUrl: 'client/index.ng.html',
		resolve: {
			currentUser: ['$meteor', function($meteor) {
				return $meteor.waitForUser();
			}]
		}
	})
	.state('user.index', {
		url: '/',
		templateUrl: 'client/user/cheques/list.ng.html',
		controller: 'ListCtrl',
		resolve: {
			proveedoresSub: ['$meteor', function($meteor){
				return $meteor.subscribe('proveedores');
			}],
			proveedores: ['$meteor', 'proveedoresSub', function($meteor){
				return $meteor.collection(Proveedores, false);
			}]
		}
	})
	.state('user.nuevo', {
		url: '/cheque-nuevo',
		templateUrl: 'client/user/cheques/cheque.ng.html',
		controller: 'ChequeNuevoCtrl',
		resolve: {
			chequesSub: ['$meteor', function($meteor){
				return $meteor.subscribe('cheques');
			}],
			cheques: ['$meteor', 'chequesSub', function($meteor){
				return $meteor.collection(Cheques, false);
			}],
			proveedoresSub: ['$meteor', function($meteor){
				return $meteor.subscribe('proveedores');
			}],
			proveedores: ['$meteor', 'proveedoresSub', function($meteor){
				return $meteor.collection(Proveedores, false);
			}]
		}
	})
	.state('user.editar', {
		url: '/cheque/:id',
		templateUrl: 'client/user/cheques/cheque.ng.html',
		controller: 'ChequeEditarCtrl',
		resolve: {
			chequesSub: ['$meteor', function($meteor){
				return $meteor.subscribe('cheques');
			}],
			cheque: ['$meteor', '$stateParams', 'chequesSub', function($meteor, $params){
				return $meteor.object(Cheques, $params.id, false);
			}],
			proveedoresSub: ['$meteor', function($meteor){
				return $meteor.subscribe('proveedores');
			}],
			proveedores: ['$meteor', 'proveedoresSub', function($meteor){
				return $meteor.collection(Proveedores, false);
			}]
		}
	});
}])
.controller('ListCtrl', ['$scope', '$meteor', '$modal', 'proveedores', 'Notification', function($scope, $meteor, $modal, proveedores, Notification){
	var hoy = new Date();
	$scope.proveedores = proveedores;
	$scope.year = "" + hoy.getFullYear();
	$scope.monto = 0;
	$scope.meses = meses;
	$scope.busqueda = {
		filtro: "pagado",
		year: hoy.getFullYear(),
		mes: meses[hoy.getMonth()],
		inverso: false
	};
	$scope.cheques = $scope.$meteorCollection(function (){
		var sort = {},
			busqueda = {};
			proveedor = $scope.getReactively('busqueda.proveedor'),
		
		sort[$scope.getReactively('busqueda.filtro')+""] = $scope.getReactively('busqueda.inverso') ? -1 : 1;
		sort.fechaPago = 1;

		if (proveedor && proveedor != "") {
			busqueda.proveedor = { $regex : proveedor, $options:"i"};
		}
		return Cheques.find(busqueda, {sort: sort});
	}, true);
		
	$meteor.autorun($scope, function() {
		var date = new Date($scope.getReactively('busqueda.year'), meses.indexOf($scope.getReactively('busqueda.mes')), 1);
		$scope.$meteorSubscribe('cheques-search', {fechaPago: {$gte: date}});
	});

	$scope.borrar = function(cheque){
		$modal.open({
			templateUrl: 'client/modals/confirm.ng.html',
			controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
				$scope.action = "eliminar este cheque";
			}]
		}).result.then(function() {
			$scope.cheques.remove(cheque._id).then(function(data){
				Notification.success({message: "cheque eliminado", delay: 2000});
			}, function (error){
				console.log(error);
				Notification.error({message: "Error, contacta a Fer", delay: 2000});
			});
		});
   	};

   	$scope.sePagaHoy = function(cheque){
   		if (cheque.fechaPago <= new Date() && !cheque.pagado) {
   			return "hoy";
   		}else if(!cheque.pagado){
   			return "no-pagado";
   		}
   	};

   	$scope.$watch('year', function(nuevo, viejo){
   		$scope.busqueda.year = parseInt(nuevo);
   	});

   	function actualizarVencimientos(){ 
		$scope.vencimientoH = $scope.monto;
		$scope.vencimientoM = $scope.monto;
		var tomorrow = new Date();
		tomorrow.setDate(hoy.getDate()+1);
		_.each($scope.cheques, function(cheque){
			if (cheque.fechaPago<=hoy && !cheque.pagado) $scope.vencimientoH -= cheque.monto;
			if (cheque.fechaPago<=tomorrow && !cheque.pagado) $scope.vencimientoM -= cheque.monto;
		});
   	};

	$scope.$watch('monto', function(){
		actualizarVencimientos();
	});
	$scope.$watch('cheques', function(){
		actualizarVencimientos();
	}, true);
}])
.controller('ChequeNuevoCtrl', ['$scope', '$state', 'cheques', 'proveedores', 'Notification', function($scope, $state, cheques, proveedores, Notification){
	$scope.proveedores = proveedores;
	$scope.cheques = cheques;
	$scope.cheque = {};
	$scope.settings = {
		calOpened: false
	};
	$scope.guardar = function (){
		cheques.save($scope.cheque).then(function(){
			Notification.success({message: "Cheque salvado"});
			$state.go('user.index');
		}, function(error){
			Notification.error({message: "No pudo salvarse el cheque, comuniquese con Fer"});
			console.log(error);
		});
	};
}])
.controller('ChequeEditarCtrl', ['$scope', '$state', 'cheque', 'proveedores', 'Notification', function($scope, $state, cheque, proveedores, Notification){
	$scope.proveedores = proveedores;
	$scope.cheque = cheque;
	$scope.settings = {
		calOpened: false
	};
	$scope.guardar = function (){
		cheque.save().then(function(){
			Notification.success({message: "Cheque salvado"});
			$state.go('user.index');
		}, function(error){
			Notification.error({message: "No pudo salvarse el cheque, comuniquese con Fer"});
			console.log(error);
		});
	};
}])
;