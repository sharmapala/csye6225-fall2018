(function () {
//immediately invoked function expressions
    angular
        .module("WebAppMaker")
        .controller("transactionListController", transactionListController)

    function transactionListController(transactionService, user) {
        var model = this;
        var userId = user.id;

        function init(){
            model.userId = userId;
            transactionService.getTransactions(userId)
                .then(function (transactions) {
                    model.transactions = transactions;
                });
        }
        init();

    }
})();
