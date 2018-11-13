(function (){
    angular
        .module("WebAppMaker")
        .controller("passController", passController) ;


        function passController(userService)
        {
            var model = this;
            model.resetPassword = resetPassword;
            function init(){
    
            }
            init();
    
            function resetPassword(email){
                userService.resetPassword(email);
            }
        }
    })();