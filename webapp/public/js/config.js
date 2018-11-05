(function () {
//immediately invoked function expressions
    angular
        .module("WebAppMaker")
        .config(configuration);

    function configuration($routeProvider, $httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
        $routeProvider
            .when("/", {
                templateUrl: "views/user/templates/login.view.client.html",
                controller: "loginController",
                controllerAs: "model"
            })
            .when("/login", {
                templateUrl: "views/user/templates/login.view.client.html",
                controller: "loginController",
                controllerAs: "model"
            })
            .when("/register", {
                templateUrl: "views/user/templates/register.view.client.html",
                controller: "registerController",
                controllerAs: "model"
            })
            .when("/user", {
                templateUrl: "views/user/templates/profile.view.client.html",
                controller: "profileController",
                controllerAs: "model",
                resolve: {
                    user: checkLogin
                }
            })
            .when("/resetpassword", {
                templateUrl: "views/user/templates/resetpassword.view.client.html",
                controller: "passController",
                controllerAs: "model",
            })
            .when("/transaction", {
                templateUrl: "views/transaction/templates/transaction-list.view.client.html",
                controller: "transactionListController",
                controllerAs: "model",
                resolve: {
                    user: checkLogin
                }
            })
            .when("/transaction/new", {
                templateUrl: "views/transaction/templates/transaction-new.view.client.html",
                controller: "transactionNewController",
                controllerAs: "model",
                resolve: {
                    user: checkLogin
                }
            })
            .when("/transaction/:tid", {
                templateUrl: "views/transaction/templates/transaction-edit.view.client.html",
                controller: "transactionEditController",
                controllerAs: "model",
                resolve: {
                    user: checkLogin
                }
            })
            .when("/transaction/:tid/attachment", {
                templateUrl: "views/attachment/templates/attachment-list.view.client.html",
                controller: "attachmentListController",
                controllerAs: "model",
                resolve: {
                    user: checkLogin
                }
            })
            .when("/transaction/:tid/attachment/new", {
                templateUrl: "views/attachment/templates/attachment-new.view.client.html",
                controller: "attachmentController",
                controllerAs: "model",
                resolve: {
                    user: checkLogin
                }
            })
            .when("/transaction/:tid/attachment/:aid", {
                templateUrl: "views/attachment/templates/attachment-edit.view.client.html",
                controller: "attachmentEditController",
                controllerAs: "model",
                resolve: {
                    user: checkLogin
                }
            })
            .otherwise({
                redirectTo: "/"
            });
}
    
    function checkLogin(userService, $q, $location) {
        var deferred = $q.defer();
        userService
            .checkLogin()
            .then(function (user) {
                if(user === "0") {
                    deferred.reject();
                    $location.url("/login");
                } else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }
})();
