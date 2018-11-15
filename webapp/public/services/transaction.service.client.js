(function (){
    angular
        .module("WebAppMaker")
        .service("transactionService", transactionService);

    function transactionService($http){
        this.getTransactions = getTransactions;
        this.createTransaction = createTransaction;
        this.findTransactionById = findTransactionById;
        this.deleteTransaction = deleteTransaction;
        this.updateTransaction = updateTransaction;

        function findTransactionById(transactionId)
        {
            var url = "/api/transaction/" + transactionId;
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function createTransaction(userId, transaction){
            var url = "/api/user/" + userId + "/transaction";
            return $http.post(url, transaction);
        }

        function updateTransaction(transactionId, transaction){
            var url = "/api/transaction/" + transactionId;
            return $http.put(url, transaction);
        }

        function deleteTransaction(transactionId){
            var url = "/api/transaction/" + transactionId;
            return $http.delete(url);
        }

        function getTransactions(userId){
            var url = "/api/user/" + userId + "/transaction";
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();