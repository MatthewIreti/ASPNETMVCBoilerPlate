var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var UserDetailCtrl = (function (_super) {
    __extends(UserDetailCtrl, _super);
    function UserDetailCtrl($scope, UserProfileResource) {
        _super.call(this, $scope, UserProfileResource, "site.index");
        this.$scope.backLink.state = "site.usermanagement.index";
        this.$scope.title = "Details";
        this.$scope.breadcrumbs.push({ title: "Home", link: "site.home" }, { title: "Administrators ", link: "site.usermanagement.index" }, { title: "Details" });
    }
    UserDetailCtrl.$inject = ["$scope", "UserProfileResource"];
    return UserDetailCtrl;
}(BaseDetailCtrl));
angular.module("app").controller("UserDetailCtrl", UserDetailCtrl);
//# sourceMappingURL=DetailCtrl.js.map