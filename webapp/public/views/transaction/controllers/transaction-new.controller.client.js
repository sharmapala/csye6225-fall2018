
(function () {
//immediately invoked function expressions
    angular
        .module("WebAppMaker")
        .controller("transactionNewController", transactionNewController);

    function transactionNewController($routeParams, $location, transactionService, user) {
        var model = this;

        model.createTransaction = createTransaction;

        var userId = user.id;
        function init(){
            model.userId = userId;
            // transactionService.getTransactions(userId)
            //     .then(function (transactions) {
            //         model.transactions = transactions;
            //     });
        }
        init();

        function createTransaction(transaction){
           transactionService.createTransaction(userId, transaction)
               .then(function () {
                   $location.url("/transaction");
               });
        }
    }
})();
