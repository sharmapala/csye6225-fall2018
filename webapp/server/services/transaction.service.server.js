var app = require("../../express");
var transactionModel =  require("../models/transaction/transaction.modal.server");

app.post("/api/user/:userId/transaction", createTransaction);
app.get("/api/user/:userId/transaction", getTransactions);
app.get("/api/transaction/:transactionId", findTransactionById);
app.put("/api/transaction/:transactionId", updateTransaction);
app.delete("/api/transaction/:transactionId", deleteTransaction);

function deleteTransaction(request, response) {
    var transactionId = request.params.transactionId;
    transactionModel.deleteTransaction(transactionId)
        .then(function (status) {
            response.json(status);
        }, function (err) {
            response.send(err);
        });
}

function updateTransaction(request, response) {
    var transactionId = request.params.transactionId;
    var transaction = request.body;
    transactionModel.updateTransaction(transactionId, transaction)
        .then(function (status) {
            response.json(status);
        }, function (err) {
            response.send(err);
        })
}

function findTransactionById(request, response) {
    var transactionId = request.params.transactionId;
    transactionModel.findTransactionById(transactionId)
        .then(function (transaction) {
           response.json(transaction);
        }, function (err) {
            response.send(err);
        });
}

function getTransactions(request, response){
    var userId = request.params.userId;
    transactionModel.getTransactions(userId)
        .then(function (transactions) {
            response.json(transactions);
        }, function (err) {
            response.send(err);
        });
}

function createTransaction(request, response) {
    var userId = request.params.userId;
    var transaction = request.body;
    transaction.userId = userId;
    transactionModel
        .createTransaction(transaction)
        .then(function (transaction) {
            response.json(transaction);
        }, function (err) {
            response.send(err);
        });
}