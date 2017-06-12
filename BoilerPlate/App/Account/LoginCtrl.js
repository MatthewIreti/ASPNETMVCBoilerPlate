/// <reference path="../models.ts" />
var LoginCtrl = (function () {
    function LoginCtrl($scope, UserProfileResource, AccountSvc) {
        var _this = this;
        this.$scope = $scope;
        this.UserProfileResource = UserProfileResource;
        this.AccountSvc = AccountSvc;
        $scope.userInfo = {};
        $scope.waiting = 0;
        $scope.errors = [];
        $scope.validationRule = {
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                }
            },
            messages: {}
        };
        $scope.submitForm = function () { return _this.submitForm(); };
    }
    LoginCtrl.prototype.submitForm = function () {
        var _this = this;
        this.$scope.waiting++;
        this.AccountSvc.login(this.$scope.userInfo, function (data) {
            $.cookie("token", data.access_token, { path: '/' });
            _this.UserProfileResource.getCurrentUserInfo().$promise.then(function (resp) {
                if (resp.emailAddress === "" || resp.emailAddress === null) {
                    _this.$scope.$state.go("account.updateemailaddress", resp);
                }
                else if (!resp.passwordChanged) {
                    _this.$scope.$state.go("account.changepassword");
                }
                else {
                    location.pathname = "/";
                }
            });
        }, function (response) {
            _this.$scope.$apply(function () {
                _this.$scope.waiting--;
                _this.$scope.errors = _this.$scope.errorHandle.handleError(response);
            });
        });
    };
    LoginCtrl.$inject = ["$scope", 'UserProfileResource', "AccountSvc"];
    return LoginCtrl;
}());
angular.module("app").controller("LoginCtrl", LoginCtrl);
;
//# sourceMappingURL=LoginCtrl.js.map