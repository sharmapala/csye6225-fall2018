

var db =  require(process.cwd()+"/server/models/database");

var attachmentModel = db.attachments;

attachmentModel.createAttachment = createAttachment;
attachmentModel.getAttachment =  getAttachment ;
attachmentModel.deleteAttachment = deleteAttachment;
attachmentModel.updateAttachment = updateAttachment;
attachmentModel.findAttachmentById = findAttachmentById;

module.exports = attachmentModel;

function createAttachment(attachment) {
    return attachmentModel.create(attachment);   
}

function getAttachment(transactionId) {
    return attachmentModel.findAll({where: {transactionId: transactionId}});
}

function deleteAttachment(attachmentId) {
    return attachmentModel.destroy({where: {id: attachmentId}});
}

function updateAttachment(attachmentId, attachment) {
    return attachmentModel.update(attachment, {where: {id: attachmentId}});
}

function findAttachmentById(attachmentId) {
    return attachmentModel.findOne({where: {id: attachmentId}});
}