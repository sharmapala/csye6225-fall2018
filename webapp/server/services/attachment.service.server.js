var app = require(process.cwd()+"/express");
var multerS3 = require('multer-s3');
var aws = require('aws-sdk');
var attachmentModel =  require(process.cwd()+"/server/models/attachment/attachment.model.server");
var multer = require('multer'); // npm install multer --save

// app.post("/api/transaction/:transactionId/attachment", createAttachment);
app.get("/api/transaction/:transactionId/attachment", getAttachment);
app.get("/api/attachment/:attachmentId", findAttachmentById);
// app.put("/api/attachment/:attachmentId", updateAttachment);
app.delete("/api/attachment/:attachmentId", deleteAttachment);


var upload;
var attachment_url;
var node_env = process.env.NODE_ENV;
if(node_env == 'dev'){
    // var credentials = {
    //     "accessKeyId": process.env.AWSKEY, 
    //     "secretAccessKey": process.env.AWSSECRETKEY
    // };
    var bucketname = process.env.BUCKETNAME;
    console.log(bucketname)
    var s3 = new aws.S3();
    // var params = {
    //     Bucket: 'cloudtest1234bucket',
    //     Key: '${req.body.filename}'
    // };
    // s3.deleteObject
    upload = multer({
        storage: multerS3({
          s3: s3,
          bucket: bucketname,
          metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
          },
          key: function (req, file, cb) {
            var path = file.originalname;
            console.log(path);
            cb(null, path)
          },
          acl: 'public-read-write'
          
        })
      });
          bucket: bucketname,
    attachment_url = 'https://s3.amazonaws.com/' + bucketname + '/';
}
else {
    upload = multer({ dest: __dirname+'/../../public/uploads' });
    attachment_url = '/uploads/';
}



app.post ("/api/uploads", upload.single('myFile'), createAttachment);
app.post ("/api/uploads/edit", upload.single('myFile'), updateAttachment);


function createAttachment(request, response) {
    var myFile        = request.file;
    var transactionId = request.body.transactionId;
    var originalname  = myFile.originalname; // file name on user's computer
    var filename      = myFile.filename;     // new file name in upload folder
    var path          = myFile.path;         // full path of uploaded file
    var destination   = myFile.destination;  // folder where file is saved to
    var size          = myFile.size;
    var mimetype      = myFile.mimetype;
    attachment = {};
    if(node_env == 'dev')
        attachment.url = attachment_url+originalname;
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
    var myFile        = request.file;
    var transactionId = request.body.transactionId;
    var attachmentId = request.body.attachmentId;
    var originalname  = myFile.originalname; // file name on user's computer
    var filename      = myFile.filename;     // new file name in upload folder
    var path          = myFile.path;         // full path of uploaded file
    var destination   = myFile.destination;  // folder where file is saved to
    var size          = myFile.size;
    var mimetype      = myFile.mimetype;
    attachment = {};
    if(node_env == 'dev')
        attachment.url = attachment_url+originalname;
    else
        attachment.url = attachment_url+filename;
    attachment.transactionId = transactionId;
    attachmentModel.updateAttachment(attachmentId, attachment)
    .then(function (attachment) {
        var callbackUrl   = "/#!/transaction/"+transactionId+"/attachment";
        response.redirect(callbackUrl);
    }, function (err) {
        response.send(err);
    });;
    
}

function deleteAttachment(request, response) {
    var attachmentId = request.params.attachmentId;
    attachmentModel.deleteAttachment(attachmentId)
        .then(function (status) {
            response.json(status);
        }, function (err) {
            response.send(err);
        });
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
    var attachmentId = request.params.attachmentId;
    attachmentModel.findAttachmentById(attachmentId)
        .then(function (attachment) {
           response.json(attachment);
        }, function (err) {
            response.send(err);
        });
}

function getAttachment(request, response){
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