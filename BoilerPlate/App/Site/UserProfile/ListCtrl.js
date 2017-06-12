var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var UserListCtrl = (function (_super) {
    __extends(UserListCtrl, _super);
    function UserListCtrl($scope, UserProfileResource) {
        _super.call(this, $scope, UserProfileResource);
        this.locaScope = $scope;
        this.localResource = UserProfileResource;
        $scope.title = "Users";
        this.$scope.breadcrumbs.push({ title: "Home", link: "site.home" }, { title: this.$scope.title });
        this.init();
    }
    UserListCtrl.$inject = ["$scope", "UserProfileResource"];
    return UserListCtrl;
}(BaseListCtrl));
angular.module("app").controller("UserListCtrl", UserListCtrl);
//# sourceMappingURL=ListCtrl.js.map