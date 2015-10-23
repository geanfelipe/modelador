var area = "";

function getArea(){
  return area;
}


modelagemApp.controller('modelagemCtrl',[
    '$scope',
    'modelagemService',
    function($scope,modelagemService){
        $scope.aba = 1;
        $scope.tabAplicativo=false;
        $scope.secretaria ='';
        $scope.salvado='';
        $scope.analyst ='';
        $scope.secretarias = '';
        $scope.secretariaSelecionada=null;
        $scope.formulariosDeSecretaria=null;
        $scope.formulario='';
        $scope.formularioSelecionado = false;
        $scope.Nome = null;
        $scope.AbaDeAplicativo=false;

        var lista_de_secretarias= {};
        var json =angular.fromJson(modelagemService.query());
      

        $scope.trocarAba = function(secretaria,subordinada)
        {
            $scope.secretariaSelecionada=secretaria+":"+subordinada;
            $scope.aba = $scope.aba==1 ? $scope.aba=2:$scope.aba=1;
            
            if($scope.secretariaSelecionada===null){
              //FACA NADA
            }else{
              $scope.tabAplicativo = $scope.tabAplicativo===false ? $scope.tabAplicativo=true:$scope.tabAplicativo=false;
              $scope.AbaDeAplicativo=true;
              $("#aba-de-aplicativo").addClass("active");
            }
        };
        
        $scope.uri = function(secretaria){
        	var uri = '';
        	if(secretaria){
        		secretaria = secretaria.split(':')[0].toUpperCase()+' : '+secretaria.split(':')[1].capitalizeFirstLetter();
        		uri = secretaria.replace(':','/');
        	}
        	
        	return function(formulario) {
        		if(formulario!=null && formulario!=''){
        			uri += ' / '+formulario.capitalizeFirstLetter();
        		}
        		return uri;
        	};
        };

        $scope.selecionarFormulario = function(formulario)
        {
            $scope.formularioSelecionado = formulario;
            console.log(formulario);
            area=formulario;
            listagemDeDados();
        };
        
        $scope.mostrarForms = function(objView)
        {
            if($scope.aba==2 && $scope.formularioSelecionado)
            {
              return true;
            } 
            return false;
        };
        
        /*retornado o json faca as seguintes operacoes*/
        /*Vide: o promise é a ultima coisa que é carregada no controller*/
        json.$promise.then(function(data)
        {
            $scope.analyst = data.analyst;
            
            $scope.secretarias = menuSecretaria(data.groups);
            
            $scope.listarFormularioDeSecretaria = function(secretaria)
            {
                if(secretaria!==null)
                {
                    return Object.keys(data.groups[secretaria]);
                }
            };
           
            $scope.segmentos = function(secretaria,formulario){
               
                /* objeto contruido com as views de cada entidade do campo semantico selecionado*/
                var objView = {};
                /* iteração dentro das entidades de um campo semantico */
                angular.forEach(data.groups[secretaria][formulario],function(value1,key1){
                    if(key1!='asDefined'){
                        /* iteração dentro dos atributos das entidades */
                        angular.forEach(value1.attributes,function(value2,key2){
                            if(key2!='asDefined'){
                                objView[key1+'.'+key2+'.'+value2.view.title] = value2.view;
                            }
                        });
                    }
                });
                $scope.campoDeFormulario = buildSegment(objView);
                console.log($scope.campoDeFormulario);
            };
        });
      
        $scope.renderizar = function(key,field)
        {
            renderize(key,field);
            $("#area-listagem").hide();
            $("#area-formulario").show();
            console.log($scope.Nome);
        };
    }
]);