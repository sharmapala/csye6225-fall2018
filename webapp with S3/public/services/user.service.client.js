(function (){
    angular
        .module("WebAppMaker")
        .factory("userService", userService);

    function userService($http){
        var _api = {
            "login": login,
            "getTime": getTime,
            "registerUser": registerUser,
            "findUserByUsername": findUserByUsername,
            "checkLogin": checkLogin,
            "logoutUser": logoutUser,
            "resetPassword": resetPassword
        };

        return _api;

        function getTime() {
            var url = "/time";
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function checkLogin() {
            var url = "/api/checkLogin";
            return $http.get(url)
                .then(function (response) {
                   return response.data;
                });
        }

        function findUserByUsername(username){
            var url = "/api/user?username=" + username;
            return $http.get(url)
                .then(function(response){
                    return response.data;
                });
        }

        function registerUser(user)
        {
            var url = "/user/register";
            return $http.post(url, user)
                .then(function(response){
                    return response.data;
                });
        }

        function login(username, password)
        {
            var url = "/api/login";
            return $http.post(url, {username: username, password: password})
                .then(function(response){
                    return response.data;
                }, function (err) {
                    return null;
                });
        }
        
        function resetPassword(email){
            var url = "/api/reset";
            return $http.post(url, {email: email})
                .then(function(response){
                    return response.data;
                }, function (err) {
                    return null;
                });
        }

        function logoutUser(){
            var url = "/api/logout";
            return $http.get(url);
        }
    }
})();