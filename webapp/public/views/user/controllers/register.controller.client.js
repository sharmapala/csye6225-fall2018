(function (){
    angular
        .module("WebAppMaker")
        .controller("registerController", registerController);

    function registerController($location, userService)
    {
        var model = this;
        const saltRounds = 10;
        model.registerUser = registerUser;
        function init(){

        }
        init();

        function registerUser(user){
            if(user.password === user.password1)
            {
            userService.findUserByUsername(user.username)
                .then(function (user_r) {
                    var _user = user_r;
                    if(!_user){
                        return userService.registerUser(user)
                    }
                    else {
                        model.error = "User already exists";
                    }
                })
                .then(function (user) {
                    if(user)
                        $location.url("/login");
                });
            }
            else{
                model.error = "Passwords dont match";
            }
        }
    }
})();