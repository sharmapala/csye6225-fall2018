var app = require(process.cwd()+"/express");
var transactionModel =  require(process.cwd()+"/server/models/transaction/transaction.modal.server");
var aws = require('aws-sdk');
app.post("/api/user/:userId/transaction", createTransaction);
app.get("/api/user/:userId/transaction", getTransactions);
app.get("/api/transaction/:transactionId", findTransactionById);
app.put("/api/transaction/:transactionId", updateTransaction);
app.delete("/api/transaction/:transactionId", deleteTransaction);
var cw = new aws.CloudWatch({apiVersion: '2010-08-01'});
createTransaction.counter = 0;
getTransactions.counter = 0;
findTransactionById.counter = 0;
updateTransaction = 0;
deleteTransaction = 0;
var winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
function deleteTransaction(request, response) {
    deleteTransaction.counter++;
    console.log(deleteTransaction.counter);
    var params = {
        MetricData: [
          {
            MetricName: 'api -  /api/transaction/:transactionId"',
            Dimensions: [
              {
                Name: 'api',
                Value: 'counter'
              },
            ],
            Unit: 'None',
            Value: deleteTransaction.counter
          },
        ],
        Namespace: 'deleteTransactionByIdApi/traffic'
      };
    cw.putMetricData(params, function(err, data) {
        if (err) {
          logger.info("Error", err);
        } else {
          logger.info("Success", JSON.stringify(data));
        }
      });
    var transactionId = request.params.transactionId;
    transactionModel.deleteTransaction(transactionId)
        .then(function (status) {
            response.json(status);
        }, function (err) {
            response.send(err);
        });
}

function updateTransaction(request, response) {

    updateTransaction.counter++;
    console.log(updateTransaction.counter);
    var params = {
        MetricData: [
          {
            MetricName: 'api -  /api/transaction/:transactionId"',
            Dimensions: [
              {
                Name: 'api',
                Value: 'counter'
              },
            ],
            Unit: 'None',
            Value: updateTransaction.counter
          },
        ],
        Namespace: 'updateTransactionByIdApi/traffic'
      };
    cw.putMetricData(params, function(err, data) {
        if (err) {
          logger.info("Error", err);
        } else {
          logger.info("Success", JSON.stringify(data));
        }
      });
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

    findTransactionById.counter++;
    console.log(findTransactionById.counter);
    var params = {
        MetricData: [
          {
            MetricName: 'api -  /api/transaction/:transactionId"',
            Dimensions: [
              {
                Name: 'api',
                Value: 'counter'
              },
            ],
            Unit: 'None',
            Value: findTransactionById.counter
          },
        ],
        Namespace: 'findTransactionByIdApi/traffic'
      };
    cw.putMetricData(params, function(err, data) {
        if (err) {
          logger.info("Error", err);
        } else {
          logger.info("Success", JSON.stringify(data));
        }
      });
    var transactionId = request.params.transactionId;
    transactionModel.findTransactionById(transactionId)
        .then(function (transaction) {
           response.json(transaction);
        }, function (err) {
            response.send(err);
        });
}

function getTransactions(request, response){

    getTransactions.counter++;
    console.log(getTransactions.counter);
    var params = {
        MetricData: [
          {
            MetricName: 'api -  /api/user/:userId/transaction"',
            Dimensions: [
              {
                Name: 'api',
                Value: 'counter'
              },
            ],
            Unit: 'None',
            Value: getTransactions.counter
          },
        ],
        Namespace: 'getTransactionsApi/traffic'
      };
    cw.putMetricData(params, function(err, data) {
        if (err) {
          logger.info("Error", err);
        } else {
          logger.info("Success", JSON.stringify(data));
        }
      });
    var userId = request.params.userId;
    transactionModel.getTransactions(userId)
        .then(function (transactions) {
            response.json(transactions);
        }, function (err) {
            response.send(err);
        });
}

function createTransaction(request, response) {
    createTransaction.counter++;
    console.log(createTransaction.counter);
    var params = {
        MetricData: [
          {
            MetricName: 'api -  /api/user/:userId/transaction"',
            Dimensions: [
              {
                Name: 'api',
                Value: 'counter'
              },
            ],
            Unit: 'None',
            Value: createTransaction.counter
          },
        ],
        Namespace: 'TransactionApi/traffic'
      };
    cw.putMetricData(params, function(err, data) {
        if (err) {
          logger.info("Error", err);
        } else {
          logger.info("Success", JSON.stringify(data));
        }
      });
    
    var userId = request.params.userId;
    var transaction = request.body;
    transaction.userId = userId;
    var amttype = parseInt(transaction.amount);
    if (isNaN(amttype)) 
    {
      return response.json("Enter correct amount");
    }
    console.log(amttype);
    transactionModel
        .createTransaction(transaction)
        .then(function (transaction) {
            response.json(transaction);
        }, function (err) {
            response.send(err);
        });
}
