
(function () {
//immediately invoked function expressions
    angular
        .module("WebAppMaker")
        .controller("attachmentController", attachmentController);

    function attachmentController($routeParams, $location, attachmentService) {
        var model = this;

        var transactionId = $routeParams["tid"];
        function init(){
            model.transactionId = transactionId;
            attachmentService.getAttachment(transactionId)
                .then(function (attachment) {
                    model.attachment = attachment;
                });
        }
        init();
    }
})();
