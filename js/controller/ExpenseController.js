/*
 * Expense Controller
 */

var listar = {
    carregarValoresParaLista: function(id, description, value){
        change(id, description, value);
    }
}

 expenseApp.controller('expenseController', function($scope) {
    //It should be coming from a service or DAO
    $scope.list = [];

    var i =0;
    var modoEdicao = false;     
    var indexLista;
    NUM_ITENS_DELETADOS = 1;

    $scope.addExpense = function() {    
        var expense = {};

        //testa se esta no modo edit ou insert
        if (modoEdicao) {
            expense.id = $scope.list[indexLista].id;
        } else{
            //expense.id = i++;  
            expense.id = functions.genID($scope.list);
        };  
        expense.description = $scope.description;
        expense.value = $scope.value;

        if (modoEdicao) {
            functions.deletePublicationFromById($scope.list[indexLista].id);        
            $scope.list.splice(indexLista,NUM_ITENS_DELETADOS);            
            //$scope.list.splice(indexLista,NUM_ITENS_DELETADOS, expense);  
            $scope.list.push(expense);          
        } else{
            $scope.list.push(expense);
        }

        //zera variaveis
        $scope.description = $scope.value = "";
        modoEdicao = false;
        functions.addPublication(expense.id, expense.description, expense.value);
    }


    $scope.removeItem = function(index){
        functions.deletePublicationFromById($scope.list[index].id)        
        //functions.clearObjectStore();        
        $scope.list.splice(index,NUM_ITENS_DELETADOS);
    }   


    $scope.updateItem = function(index){
        document.getElementById("description").value = $scope.list[index].description;
        document.getElementById("value").value = $scope.list[index].value;          
        modoEdicao = true;
        indexLista = index;
    }


    $scope.listarNoticias = function(id, description, value){
        var expense = {};
        expense.id = id;
        expense.description = description;
        expense.value = value;
        $scope.list.push(expense);        
    };    
 });

//recupera o escopo
function change(id, description, value) {
    var scope = angular.element($("#lista")).scope(); 
    scope.$apply(function(){
        /*$scope.list = {id: 1, description:"Lunch", value:22.12},
                     {id: 2, description:"Coffee", value:1.00},
                     {id: 3, description:"Desert", value:5.00};*/
        scope.listarNoticias(id,description,value);
    })
};

/**************************************
********* GRAFICO DE Area ************
**************************************/

// CARREGA A API
google.load('visualization', '1.0', {'packages':['corechart']});

// CARREGA OS GRaFICOS, DE PIZZA E aREA.
google.setOnLoadCallback(drawVisualization);

function drawVisualization() {
// InformaÃ§Ãµes do GrÃ¡fico
var ufs =
['Nº Buracos'];

var meses = ['2014/04', '2014/05', '2014/06', '2014/07', '2014/08', '2014/09', '2014/10', '2014/11', '2014/12'];
var vendasporuf = [[165, 135, 157, 139, 136]];

// Criar e popular os dados
var data = new google.visualization.DataTable();
data.addColumn('string', 'mes');
    for (var i = 0; i < ufs.length; ++i) {
    data.addColumn('number', ufs[i]);
    }
    data.addRows(meses.length);
    for (var i = 0; i < meses.length; ++i) {
    data.setCell(i, 0, meses[i]);
    }
    for (var i = 0; i < ufs.length; ++i) {
    var uf = vendasporuf[i];
    for (var mes = 0; mes < meses.length; ++mes) {
    data.setCell(mes, i + 1, uf[mes]);
}
}

//escolher a DIV que vai exibir o grÃ¡fico
var vDiv = document.getElementById('grafico_area');

//Instanciar os grÃ¡ficos.
var ac = new google.visualization.AreaChart(vDiv);
    ac.draw(data, {
    title : 'Buracos por Bairro',
    isStacked: true,
    width: 578,
    height: 400,
    vAxis: {title: "Buracos"},
    hAxis: {title: "Bairros"}
});
}