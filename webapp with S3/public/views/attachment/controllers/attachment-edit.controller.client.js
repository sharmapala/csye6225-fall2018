(function () {
//immediately invoked function expressions
    angular
        .module("WebAppMaker")
        .controller("attachmentEditController", attachmentEditController);

    function attachmentEditController($routeParams, $location, attachmentService, user) {
        var model = this;

        model.deleteAttachment = deleteAttachment;

        var transactionId = $routeParams["tid"];
        var attachmentId = $routeParams["aid"];
        var userName = user.username;

        function init(){
            model.transactionId = transactionId;
            model.attachmentId = attachmentId;
            model.userName = userName;
        
            attachmentService.getAttachment(transactionId)
                .then(function (attachment) {
                    model.attachment = attachment;
                });
                attachmentService.findAttachmentById(attachmentId)
                .then(function (attachment) {
                    model.attachment = attachment;
                })
        }
        init();  

        function deleteAttachment(attachmentId){
            attachmentService.deleteAttachment(attachmentId, userName)
                .then(function () {
                    $location.url("/transaction/"+transactionId+"/attachment");
                });
        }
    }
})();
