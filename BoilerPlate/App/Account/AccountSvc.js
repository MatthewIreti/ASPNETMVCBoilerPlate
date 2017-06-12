var AccountSvc = (function () {
    function AccountSvc($http) {
        this.$http = $http;
    }
    AccountSvc.prototype.login = function (userInfo, successCallBack, failureCallBack) {
        userInfo.grant_type = "password";
        $.ajax({
            url: '/token',
            type: "POST",
            data: userInfo,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("token"));
            }
        }).done(function (data) {
            successCallBack(data);
        }).fail(function (response) {
            failureCallBack(response);
        });
    };
    AccountSvc.$inject = ["$http"];
    return AccountSvc;
}());
angular.module("app").service("AccountSvc", AccountSvc);
//# sourceMappingURL=AccountSvc.js.map