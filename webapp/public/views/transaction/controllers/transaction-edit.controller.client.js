(function () {
//immediately invoked function expressions
    angular
        .module("WebAppMaker")
        .controller("transactionEditController", transactionEditController);

    function transactionEditController($routeParams, $location, transactionService, user) {
        var model = this;

        model.deleteTransaction = deleteTransaction;
        model.updateTransaction = updateTransaction;

        var userId = user.id;
        var transactionId = $routeParams["tid"];

        function init(){
            model.userId = userId;
            transactionService.getTransactions(userId)
                .then(function (transactions) {
                    model.transactions = transactions;
                });
            transactionService.findTransactionById(transactionId)
                .then(function (transaction) {
                    model.transaction = transaction;
                })
        }
        init();

        function updateTransaction(transaction){
            transactionService.updateTransaction(transaction.id, transaction)
                .then(function () {
                    $location.url("/transaction");
                });
        }

        function deleteTransaction(transactionId){
            transactionService.deleteTransaction(transactionId)
                .then(function () {
                    $location.url("/transaction");
                });
        }
    }
})();
