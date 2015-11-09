//area e o local que esta selecionado. E usado posteriormente em switcharea.js
var area = "";

function getArea(){
  return area;
}

modelagemApp.controller("modelagemCtrl",[
    "$scope",
    "getDataModel",
    "sendDatasource",

    function($scope,getDataModel,sendDatasource,$compile,$rootScope){
        $scope.aba = 1;
        $scope.tabAplicativo=false;
        $scope.secretaria ='';
        $scope.analyst ='';
        $scope.secretarias = '';
        $scope.secretariaSelecionada=null;
        $scope.formulariosDeSecretaria=null;
        $scope.formulario='';
        $scope.formularioSelecionado = false;
        $scope.AbaDeAplicativo=false;
        
        var lista_de_secretarias= {};
        var json = $scope.$parent.json;
      

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
        };
        
        $scope.mostrarForms = function(objView)
        {
            if($scope.aba==2 && $scope.formularioSelecionado)
            {
              return true;
            } 
            return false;


        };


//este bloco simplesmente serve para realizar as funções de ordenar e de listar os valores da tabela.

        //sera alterado posteriormente para o dado recebido do get (service)
        $scope.pessoal = [{id: "01", nome : "Joaquim Teixeira", sexo: "Masculino"}, 
                            {id: "03", nome : "Aparecida", sexo: "Feminino"}, 
                            {id: "02", nome : "Raiane Karla Miranda Silva", sexo: "Feminino"},
                            {id: "04", nome : "Marcos", sexo: "Masculino"},
                            {id: "05", nome : "Clayton", sexo: "Masculino"},
                            {id: "06", nome : "Fulano", sexo: "Masculino"},
                            {id: "07", nome : "Beltrano", sexo: "Masculino"},
                            {id: "08", nome : "Sicrano", sexo: "Masculino"},
                            {id: "09", nome : "Maria", sexo: "Feminino"},
                            {id: "10", nome : "Tereza", sexo: "Feminino"},
                            {id: "11", nome : "Almeida", sexo: "Masculino"},
                            {id: "12", nome : "Rosa", sexo: "Feminino"},
                            {id: "11", nome : "Almeida", sexo: "Masculino"},
                            {id: "11", nome : "Almeida", sexo: "Masculino"},
                            {id: "11", nome : "Almeida", sexo: "Masculino"},
                            {id: "11", nome : "Almeida", sexo: "Masculino"},
                            {id: "11", nome : "Almeida", sexo: "Masculino"},
                            {id: "11", nome : "Almeida", sexo: "Masculino"},
                            {id: "11", nome : "Almeida", sexo: "Masculino"},
                            {id: "11", nome : "Almeida", sexo: "Masculino"}];
        
        
        

        $scope.exibirPagina = function(index){
            
            $scope.paginaExibida = index;
            
            console.log($scope.paginaExibida);
        }
        
        $scope.renderizarTabela= function(){

            $scope.exibirPagina(0); // define primeira página da tabela para ser exibida

            $scope.dados = $scope.pessoal; // será alterado.

            $scope.atributos = Object.keys($scope.dados[0]); //cria um array com os atributos dos objetos

            for (atributo in $scope.atributos)  //coloca a primeira letra maiscula
            {     
                $scope.atributos[atributo]= $scope.atributos[atributo].capitalizeFirstLetter();
            }

            $scope.paginas = [];
            $scope.pagina = [];
            $scope.itemsPorPagina = 7;

            var contador=0;

            for (var i=0; i<$scope.dados.length; i++){

                $scope.pagina.push($scope.dados[i]);
                console.log($scope.dados[i]);

                if (contador==$scope.itemsPorPagina-1)
                {
                    
                    contador=0;

                    console.log($scope.pagina);

                    $scope.paginas.push($scope.pagina);

                    $scope.pagina = [];
                    
                    console.log("--");

                    console.log($scope.pagina);
                    
                }
                else
                {
                    contador++;
                }

                if (i==$scope.dados.length-1){
                    $scope.paginas.push($scope.pagina);
                }


            }
            
            console.log($scope.paginas);
        };

        $scope.sortType     = 'id'; // define o atributo que servira de parametro para a listagem
        $scope.sortReverse  = false;  // define se a listagem será na ordem normal (true) ou inversa(false)

        $scope.setSortType = function(atributo){    

            //esta funcao define o sortType e e diparada a partir do ng-click do cabecalho da coluna do respectivo atributo

            $scope.selecao = atributo; //variavel que recebe o atributo com letra maiscula
                                        //e e usada para mudar a classe do icone do cabecalho

            $scope.sortType = atributo.toLowerCase();

            $scope.sortReverse = !$scope.sortReverse;   //inverte o valor do sortReverse
                    
        }

        



//FIM DO BLOCO DE FUNCOES RELACIONADAS A TABELA


        /*retornado o json faca as seguintes operacoes*/
        /*Vide: o promise é a ultima coisa que é carregada no controller*/
        json.$promise.then(function(data) {
            $scope.nome = {};
            $scope.analyst = data.analyst;
            $scope.secretarias = menuSecretaria(data.groups);
            
            console.log(data);

            $scope.listarFormularioDeSecretaria = function(secretaria)
            {
                if(secretaria!==null)
                {
                    return Object.keys(data.groups[secretaria]);
                }
            };
           
            $scope.segmentos = function(secretaria,formulario) {
               
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
                $scope.campoDeFormulario = new ElementFactory().buildSegment(objView);
            };

            $scope.sendButton = function() {
                console.log($scope.secretariaSelecionada);
                console.log($scope.formularioSelecionado);

                getDataForms($scope.formularioSelecionado);

                // sendDatasource.save(funcionario);

            }
        });
      
        $scope.renderizar = function(key,field)
        {
            new Renderize().renderize(key,field);
        };

    }
]);