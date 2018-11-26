(function () {
//immediately invoked function expressions
    angular
        .module("WebAppMaker")
        .controller("attachmentListController", attachmentListController)

    function attachmentListController($routeParams, attachmentService) {
        var model = this;
        var transactionId = $routeParams["tid"];

        function init(){
            model.transactionId = transactionId;
            attachmentService.getAttachment(transactionId)
                .then(function (attachment) {
                    model.attachments = attachment;
                });
        }
        init();

    }
})();
