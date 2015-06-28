Template.chequesList.onRendered(function (){
	var mes = new Date().getMonth();
	$(".meses option:eq("+mes+")").prop("selected", true);
});