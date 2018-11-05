(function (){
    angular
        .module("WebAppMaker")
        .service("attachmentService", attachmentService);

    function attachmentService($http){
        this.getAttachment = getAttachment;
        this.createAttachment  = createAttachment ;
        this.findAttachmentById = findAttachmentById;
        this.deleteAttachment  = deleteAttachment ;
        this.updateAttachment  = updateAttachment ;

        function findAttachmentById(attachmentId)
        {
            var url = "/api/attachment/" + attachmentId;
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function createAttachment(transactionId, attachment){
            var url = "/api/transaction/" + transactionId + "/attachment";
            return $http.post(url, attachment);
        }

        function updateAttachment(attachmentId, attachment){
            var url = "/api/attachment/" + attachmentId;
            return $http.put(url, attachment);
        }

        function deleteAttachment(attachmentId, userName){
            var url = "/api/attachment/" + attachmentId + '/' + userName;
            return $http.delete(url);
        }

        function getAttachment(transactionId){
            var url = "/api/transaction/" + transactionId + "/attachment";
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();