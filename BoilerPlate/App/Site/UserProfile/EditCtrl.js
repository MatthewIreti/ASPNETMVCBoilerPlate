var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var UserEditCtrl = (function (_super) {
    __extends(UserEditCtrl, _super);
    function UserEditCtrl($scope, UserProfileResource) {
        _super.call(this, $scope, UserProfileResource);
        this.UserProfileResource = UserProfileResource;
        $scope.title = "Edit User";
    }
    UserEditCtrl.$inject = ["$scope", "UserProfileResource"];
    return UserEditCtrl;
}(BaseEditCtrl));
angular.module("app").controller("UserEditCtrl", UserEditCtrl);
//# sourceMappingURL=EditCtrl.js.map