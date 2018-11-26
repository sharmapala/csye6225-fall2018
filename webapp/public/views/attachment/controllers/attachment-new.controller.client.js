
(function () {
//immediately invoked function expressions
    angular
        .module("WebAppMaker")
        .controller("attachmentController", attachmentController);

    function attachmentController($routeParams, $location, attachmentService, user) {
        var model = this;
        var userName = user.username;
        var transactionId = $routeParams["tid"];
        function init(){
            model.transactionId = transactionId;
            model.userName = userName;
            attachmentService.getAttachment(transactionId)
                .then(function (attachment) {
                    model.attachment = attachment;
                });
        }
        init();
    }
})();
