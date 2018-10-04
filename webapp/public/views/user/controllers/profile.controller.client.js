(function () {
//immediately invoked function expressions
    angular
        .module("WebAppMaker")
        .controller("profileController", profileController);

    function profileController($location, userService, user) {
        var model = this;
        var userId = user.username;

        model.updateUser = updateUser;
        model.logout = logout;
        model.unregisterUser = unregisterUser;

        function init() {
            userService.findUserByUsername(userId)
                .then(function (user) {
                    model.user = user;
            });
            userService.getTime()
                .then(function (time) {
                    model.time = time;
            });
        }
        init();

        function updateUser(user) {
            userService.updateUser(user._id, user)
                .then(function () {
                    model.updateSuccessMessage = "User updated successfuly";
                });
        }

        function unregisterUser(userId) {
            userService.unregisterUser(userId)
                .then(function () {
                    $location.url("/login");
                });
        }


        function logout() {
            userService.logoutUser()
                .then(function () {
                    $location.url("/login");
                });
        }
    }

})();
