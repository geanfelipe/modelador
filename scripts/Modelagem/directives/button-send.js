modelagemApp

.directive("buttonSend",["sendDatasource",function(sendDatasource){
	return {
		restrict: 'E',
		replace: true,
		scope:{
            form:"=",
            secretaria: "=",
        },
		template: '<button class="ui button" ><i class="plus icon"></i>ADICIONAR</button>',
        link: function($scope,$elem,$attrs) {
        	$elem.bind("click",function() {
        		var entitys = $scope.$root.Models[$scope.secretaria][$scope.form];
                angular.forEach(entitys, function(entitysObject,entitysName) {
                    angular.forEach(entitysObject,function(attributesValue,attributesName) {
                        var value = "";

                        if(attributesValue.constructor===Object) {
                            angular.forEach(attributesValue,function(subAttributesValue,subAtributesName) {
                                value = angular.element("form#"+$scope.form).find(angular.element("input#"+entitysName+"\\."+subAtributesName)).val();
                                console.log(entitysName,attributesName ,value);
                            });
                        }else {
                            value = angular.element("form#"+$scope.form).find(angular.element("input#"+entitysName+"\\."+attributesName)).val();
                            console.log(entitysName,attributesName ,value);
                        }
                        
                    });
                });

     //    		sendDatasource.save({
     //    			"classUID":"br.gov.rn.parnamirim.datasource.domain.pessoal",
					// "semanticFieldUID":$scope.$parent.formularioSelecionado,
					// "object": object
     //    		});
        	});
        },
	}
}]);