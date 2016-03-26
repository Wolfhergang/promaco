angular.module('checkcontrol')
.config(function($stateProvider) {
	$stateProvider.state('user', {
		url: '/cheques',
		abstract: true,
		template: '<div ui-view></div>',
		resolve: {
			currentUser: ($q) => {
				if (Meteor.userId() == null) {
					return $q.reject();
				}
				else {
					return $q.resolve();
				}
			}
		}
	})
	.state('user.index', {
		url: '/',
		templateUrl: 'client/user/cheques/list.html',
		controller: 'ListCtrl as vm',
		resolve: {
			proveedores: () => {
				return Meteor.subscribe("proveedores");
			}
		}
	});
})
.controller('ListCtrl', function($reactive, $scope, $modal, proveedores, Notification){
	$reactive(this).attach($scope);

	this.subscribe('cheques', () => {
		return [this.getReactively("busqueda.fechaInicio"), this.getReactively("busqueda.fechaFinal")]
	});

	var hoy = new Date();
	
	this.monto = 0;
	this.busqueda = {
		filtro: "pagado",
		inverso: 1,
		proveedor: "",
		fechaInicio: new Date(hoy.getFullYear(), hoy.getMonth(), 1),
		fechaFinal: new Date(hoy.getFullYear(), hoy.getMonth()+1, 1),
	};

	this.helpers({
		proveedores: () => Proveedores.find({}),
		cheques: () => {
			var sort = {};
			if (this.getReactively('busqueda.filtro') == "fechaPago") {
				sort.fechaPago = this.getReactively('busqueda.inverso');
			}else{
				sort[this.getReactively('busqueda.filtro')+""] = this.getReactively('busqueda.inverso');
				sort.fechaPago = 1
			}
			console.log(sort);

			return Cheques.find({
				proveedor: { $regex : this.getReactively('busqueda.proveedor'), $options:"i"}
			}, {
				sort : sort
			})
		}
	});

	$scope.borrar = (cheque) => {
		$modal.open({
			templateUrl: 'client/modals/confirm.html',
			controller: ($scope, $modalInstance) => {
				$scope.action = "eliminar este cheque";
			}
		}).result.then(() => {
			Cheques.remove({_id: cheque._id},(error) => {
				if (error) {
					console.error(error);
					Notification.error("Error, contacta a Fer");
					return;
				}
			});
		});
   	};

   	$scope.sePagaHoy = (cheque) => {
   		if (cheque.fechaPago <= new Date() && !cheque.pagado) {
   			return "hoy";
   		}else if(!cheque.pagado){
   			return "no-pagado";
   		}
   	};

   	$scope.nuevoCheque = () => {
   		$modal.open({
			templateUrl: 'client/user/cheques/cheque.html',
			resolve: {
				proveedores: () => {
					return Proveedores.find({}).fetch();
				}
			},
			controller: ($scope, $modalInstance, proveedores) => {
				$scope.action = "Cheque Nuevo";
				$scope.proveedores = proveedores;
				$scope.cheque = {};
				$scope.settings = {
					calOpened: false
				};

				$scope.guardar = () => {
					$modalInstance.close($scope.cheque);
				};
			}
		}).result.then(function(chequeNuevo) {
			Cheques.insert(chequeNuevo, (error) => {
				if (error) {
					Notification.error("No pudo guardar el cheque, comuniquese con Fer");
					console.error(error);
					return;
				}
				Notification.success("Cheque guardado");
			});
		});
   	}

   	$scope.pagoCheque = (cheque) => {
   		Cheques.update({_id: cheque._id}, {$set: {pagado: cheque.pagado}}, (error) => {
			if (error) {
				Notification.error("No pudo modificar el estado de pago, comuniquese con Fer");
				console.error(error);
			}
		});
   	}

   	$scope.editar = (cheque) => {
   		$modal.open({
			templateUrl: 'client/user/cheques/cheque.html',
			resolve: {
				proveedores: () => {
					return Proveedores.find({}).fetch();
				},
				cheque: () => {
					return cheque;
				}
			},
			controller: ($scope, $modalInstance, proveedores, cheque) => {
				$scope.action = "Modificar cheque";
				$scope.proveedores = proveedores;
				$scope.cheque = cheque;
				$scope.settings = {
					calOpened: false
				};

				$scope.guardar = () => {
					$modalInstance.close($scope.cheque);
				};
			}
		}).result.then(function(chequeNuevo) {
			var id = chequeNuevo._id;
			delete chequeNuevo._id;
			delete chequeNuevo.$$hashKey;
			delete chequeNuevo.userId;

			Cheques.update({_id: id}, {$set: chequeNuevo}, (error) => {
				if (error) {
					Notification.error("No pudo guardar el cheque, comuniquese con Fer");
					console.error(error);
				}
			});
		});
   	}

   	function actualizarVencimientos(){ 
		$scope.$$vm.vencimientoH = $scope.$$vm.monto;
		$scope.$$vm.vencimientoM = $scope.$$vm.monto;
		var tomorrow = new Date();

		tomorrow.setDate(hoy.getDate()+1);

		_.each($scope.$$vm.cheques, function(cheque){
			if (cheque.fechaPago<=hoy && !cheque.pagado) $scope.$$vm.vencimientoH -= cheque.monto;
			if (cheque.fechaPago<=tomorrow && !cheque.pagado) $scope.$$vm.vencimientoM -= cheque.monto;
		});
   	};

	$scope.$watch('$$vm.monto', function(){
		actualizarVencimientos();
	});
	$scope.$watch('$$vm.cheques', function(){
		actualizarVencimientos();
	}, true);
})
;