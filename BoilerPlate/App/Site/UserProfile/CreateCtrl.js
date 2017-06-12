var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var UserCreateCtrl = (function (_super) {
    __extends(UserCreateCtrl, _super);
    function UserCreateCtrl($scope, UserProfileResource) {
        _super.call(this, $scope, UserProfileResource);
        $scope.title = "Create User";
        $scope.isCreateMode = true;
    }
    UserCreateCtrl.$inject = ["$scope", "UserProfileResource"];
    return UserCreateCtrl;
}(BaseCreateCtrl));
angular.module("app").controller("UserCreateCtrl", UserCreateCtrl);
//# sourceMappingURL=CreateCtrl.js.map