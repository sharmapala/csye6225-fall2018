var db =  require(process.cwd()+"/server/models/database");

transactionModel = db.transactions;

transactionModel.createTransaction = createTransaction;
transactionModel.getTransactions =  getTransactions;
transactionModel.deleteTransaction = deleteTransaction;
transactionModel.updateTransaction = updateTransaction;
transactionModel.findTransactionById = findTransactionById;

module.exports = transactionModel;

function createTransaction(transaction) {
    return transactionModel.create(transaction);   
}

function getTransactions(userId) {
    return transactionModel.findAll({where: {userId: userId}});
}

function deleteTransaction(transactionId) {
    return transactionModel.destroy({where: {id: transactionId}});
}

function updateTransaction(transactionId, transaction) {
    return transactionModel.update(transaction, {where: {id: transactionId}});
}

function findTransactionById(transactionId) {
    return transactionModel.findOne({where: {id: transactionId}});
}