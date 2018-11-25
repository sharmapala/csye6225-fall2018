var app = require(process.cwd()+"/express");
var fs = require('fs');
var multerS3 = require('multer-s3');
var aws = require('aws-sdk');
var attachmentModel =  require(process.cwd()+"/server/models/attachment/attachment.model.server");
var multer = require('multer'); // npm install multer --save
var winston = require('winston');
// app.post("/api/transaction/:transactionId/attachment", createAttachment);
app.get("/api/transaction/:transactionId/attachment", getAttachment);
app.get("/api/attachment/:attachmentId", findAttachmentById);
// app.put("/api/attachment/:attachmentId", updateAttachment);
var cw = new aws.CloudWatch({apiVersion: '2010-08-01'});
createAttachment.counter = 0;
getAttachment.counter = 0;
findAttachmentById.counter = 0;
updateAttachment.counter = 0;
deleteAttachment.counter = 0;
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

var bucketname = process.env.BUCKETNAME;
var upload;
var attachment_url;
var node_env = process.env.NODE_ENV;
if(node_env == 'dev'){
    // var credentials = {
    //     "accessKeyId": process.env.AWSKEY, 
    //     "secretAccessKey": process.env.AWSSECRETKEY
    // };
    // var bucketname = process.env.BUCKETNAME;
    // console.log(bucketname)
    // var s3 = new aws.S3();
    // var params = {
    //     Bucket: bucketname,
    //     Key: '${req.body.filename}'
    // };
    // s3.deleteObject
    // upload = multer({
    //     storage: multerS3({
    //       s3: s3,
    //       bucket: bucketname,
    //       metadata: function (req, file, cb) {
    //         console.log(req.body);
    //         cb(null, {fieldName: file.fieldname});
    //       },
    //       key: function (req, file, cb) {
    //           console.log(req.body, file);
    //         var path = file.originalname;
    //         console.log(path);
    //         cb(null, path)
    //       },
    //       acl: 'public-read-write'
          
    //     })
    //   });
    //       bucket: bucketname,
    // attachment_url = 'https://s3.amazonaws.com/' + bucketname + '/' ;
}
else {
    upload = multer({ dest: __dirname+'/../../public/uploads' });
    attachment_url = '/uploads/';
}


var upload = multer();
app.post ("/api/uploads", upload.array('myFile'), createAttachment);

app.post ("/api/uploads/edit", upload.array('myFile'), updateAttachment);


function createAttachment(request, response) {
    createAttachment.counter++;
    console.log(createAttachment.counter);
    var params = {
        MetricData: [
          {
            MetricName: 'api -  /api/uploads',
            Dimensions: [
              {
                Name: 'api',
                Value: 'counter'
              },
            ],
            Unit: 'None',
            Value: createAttachment.counter
          },
        ],
        Namespace: 'createAttachment/traffic'
      };
    cw.putMetricData(params, function(err, data) {
        if (err) {
          logger.info("Error", err);
        } else {
          logger.info("Success", JSON.stringify(data));
        }
      });
    var myFile        = request.files[0];
    var transactionId = request.body.transactionId;
    var userName = request.body.userName;
    var originalname  = myFile.originalname; // file name on user's computer
    var filename      = myFile.filename;     // new file name in upload folder
    var path          = myFile.path;         // full path of uploaded file
    var destination   = myFile.destination;  // folder where file is saved to
    var size          = myFile.size;
    var mimetype      = myFile.mimetype;
    var bucketname = process.env.BUCKETNAME;
    attachment = {};
    
    if(node_env == 'dev'){
    var s3 = new aws.S3();
    attachment_url = 'https://s3.amazonaws.com/' + bucketname + '/' + userName + '/';
    attachment.url = attachment_url+originalname;
    var params = {
        Bucket: bucketname,
        Key: userName+'/'+originalname,
        Body: myFile.buffer,
        ACL: 'public-read-write'
    };
    s3.upload(params, function(err, data) {
        console.log(err, data);
       });
    
        }
    else
        attachment.url = attachment_url+filename;
    attachment.transactionId = transactionId;
    attachmentModel.createAttachment(attachment)
    .then(function (attachment) {
        var callbackUrl   = "/#!/transaction/"+transactionId+"/attachment";
        response.redirect(callbackUrl);
    }, function (err) {
        response.send(err);
    });;
    
}

function updateAttachment(request, response) {
    updateAttachment.counter++;
    console.log(updateAttachment.counter);
    var params = {
        MetricData: [
          {
            MetricName: 'api -  /api/uploads/edit',
            Dimensions: [
              {
                Name: 'api',
                Value: 'counter'
              },
            ],
            Unit: 'None',
            Value: updateAttachment.counter
          },
        ],
        Namespace: 'updateAttachment/traffic'
      };
    cw.putMetricData(params, function(err, data) {
        if (err) {
          logger.info("Error", err);
        } else {
          logger.info("Success", JSON.stringify(data));
        }
      });
    var myFile        = request.files[0];
    var transactionId = request.body.transactionId;
    var attachmentId = request.body.attachmentId;
    var userName = request.body.userName;
    var originalname  = myFile.originalname; // file name on user's computer
    var filename      = myFile.filename;     // new file name in upload folder
    var path          = myFile.path;         // full path of uploaded file
    var destination   = myFile.destination;  // folder where file is saved to
    var size          = myFile.size;
    var mimetype      = myFile.mimetype;
    attachment = {};
    if(node_env == 'dev'){
    attachmentModel.findAttachmentById(attachmentId)
    .then(function (attachment) {
        console.log("Attac" + attachment);
        var s3 = new aws.S3();
        var attachment_previousurl = attachment.url
        var attch_splitoutput = attachment_previousurl.split('/');
         var attach_length = attch_splitoutput.length;
         var last_attch_filename = attch_splitoutput[attach_length -1];
         console.log("yeh aya" + last_attch_filename);
        attachment_url = 'https://s3.amazonaws.com/' + bucketname + '/' + userName + '/';
        // attachment.url = attachment_url+originalname;
        var params = {
            Bucket: bucketname, 
            Key: userName+'/'+last_attch_filename
        };
        console.log(params.key);
        s3.deleteObject(params, function(err, data) {
            console.log(err, data);
           });
        });
    var s3 = new aws.S3();
    var params = {
        Bucket: bucketname,
        Key: userName+'/'+originalname,
        Body: myFile.buffer,
        ACL: 'public-read-write'
    };
    s3.upload(params, function(err, data) {
        console.log(err, data);
       });
        attachment.url = attachment_url+originalname;
    //     attachment.transactionId = transactionId;
    // attachmentModel.updateAttachment(attachmentId, attachment)
    // .then(function (attachment) {
    //     var callbackUrl   = "/#!/transaction/"+transactionId+"/attachment";
    //     response.redirect(callbackUrl);
    // }, function (err) {
    //     response.send(err);
    // });;
        // });}
    }
    else
    {
        attachment.url = attachment_url+filename;}
    attachment.transactionId = transactionId;
    attachmentModel.updateAttachment(attachmentId, attachment)
    .then(function (attachment) {
        var callbackUrl   = "/#!/transaction/"+transactionId+"/attachment";
        response.redirect(callbackUrl);
    }, function (err) {
        response.send(err);
    });;
    
}

app.delete("/api/attachment/:attachmentId/:userName",deleteAttachment);
function deleteAttachment(request, response) {
    deleteAttachment.counter++;
    console.log(deleteAttachment.counter);
    var params = {
        MetricData: [
          {
            MetricName: 'api -  /api/attachment/:attachmentId/:userName',
            Dimensions: [
              {
                Name: 'api',
                Value: 'counter'
              },
            ],
            Unit: 'None',
            Value: deleteAttachment.counter
          },
        ],
        Namespace: 'deleteAttachment/traffic'
      };
    cw.putMetricData(params, function(err, data) {
        if (err) {
          logger.info("Error", err);
        } else {
          logger.info("Success", JSON.stringify(data));
        }
      });
    console.log(request);
    var attachmentId = request.params.attachmentId;
   // var myFile        = request.file;
  //  var transactionId = request.body.transactionId;
    var userName = request.params.userName;
    //var originalname  = myFile.originalname;
    attachment = {};
    
    attachmentModel.findAttachmentById(attachmentId)
        .then(function (attachment) {
            console.log("Attac" + attachment);
            attachmentModel.deleteAttachment(attachmentId)
                .then(function (status) {
                    if(node_env == 'dev'){
                        // attachment_url = 'https://s3.amazonaws.com/' + bucketname + '/' + userName + '/';
                       //  attachment.url = attachment_url+originalname;
                         var s3 = new aws.S3();
                         var attachment_previousurl = attachment.url
                         var attch_splitoutput = attachment_previousurl.split('/');
                          var attach_length = attch_splitoutput.length;
                          var last_attch_filename = attch_splitoutput[attach_length -1];
                          console.log("yeh aya" + last_attch_filename);
                         var params = {
                             Bucket: bucketname,
                             Key: userName+'/'+last_attch_filename
                             
                         };
                         console.log(params.Key);
                         s3.deleteObject(params, function(err, data) {
                             console.log(err, data);
                            });
                         
                             
                         }
                     else {
                         fs.unlink(__dirname+'/../../public'+ attachment.url, (err) => {});}
                    response.json(status);
                }, function (err) {
                    response.send(err);
                });
        })
        .catch(function(err){console.log(err)});
    
    
}

// function updateAttachment(request, response) {
//     var attachmentId = request.params.attachmentId;
//     var attachment = request.body;
//     attachmentModel.updateAttachment(attachmentId, attachment)
//         .then(function (status) {
//             response.json(status);
//         }, function (err) {
//             response.send(err);
//         })
// }

function findAttachmentById(request, response) {

    findAttachmentById.counter++;
    console.log(findAttachmentById.counter);
    var params = {
        MetricData: [
          {
            MetricName: 'api -  /api/attachment/:attachmentId',
            Dimensions: [
              {
                Name: 'api',
                Value: 'counter'
              },
            ],
            Unit: 'None',
            Value: findAttachmentById.counter
          },
        ],
        Namespace: 'findAttachmentById/traffic'
      };
    cw.putMetricData(params, function(err, data) {
        if (err) {
          logger.info("Error", err);
        } else {
          logger.info("Success", JSON.stringify(data));
        }
      });
    var attachmentId = request.params.attachmentId;
    attachmentModel.findAttachmentById(attachmentId)
        .then(function (attachment) {
           response.json(attachment);
        }, function (err) {
            response.send(err);
        });
}

function getAttachment(request, response){
    getAttachment.counter++;
    console.log(getAttachment.counter);
    var params = {
        MetricData: [
          {
            MetricName: 'api -  /api/transaction/:transactionId/attachment',
            Dimensions: [
              {
                Name: 'api',
                Value: 'counter'
              },
            ],
            Unit: 'None',
            Value: getAttachment.counter
          },
        ],
        Namespace: 'getAttachment/traffic'
      };
    cw.putMetricData(params, function(err, data) {
        if (err) {
          logger.info("Error", err);
        } else {
          logger.info("Success", JSON.stringify(data));
        }
      });
    var transactionId = request.params.transactionId;
    attachmentModel.getAttachment(transactionId)
        .then(function (attachments) {
            response.json(attachments);
        }, function (err) {
            response.send(err);
        });
}

// function createAttachment(request, response) {
//     var transactionId = request.params.transactionId;
//     var attachment = request.body;
//     attachment.transactionId = transactionId;
//     attachmentModel
//         .createAttachment(attachment)
//         .then(function (attachment) {
//             response.json(attachment);
//         }, function (err) {
//             response.send(err);
//         });
// }