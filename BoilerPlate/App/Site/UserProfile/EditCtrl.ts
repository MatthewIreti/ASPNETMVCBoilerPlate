

interface IUserEditCtrlScope extends ICreateEditCtrlScope {

}

interface IUserEditCtrl {

}

class UserEditCtrl extends BaseEditCtrl {
    static $inject: string[] = ["$scope", "UserProfileResource"];

    constructor($scope: IUserEditCtrlScope,
        private UserProfileResource: IUserProfileResource) {
        super($scope, UserProfileResource);
        $scope.title = "Edit User";
    }
}

angular.module("app").controller("UserEditCtrl", UserEditCtrl);
 