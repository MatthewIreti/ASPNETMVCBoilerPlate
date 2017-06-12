
interface IUserCreateCtrlScope extends ICreateEditCtrlScope {
    title: string; 
    item;
    isCreateMode;
}

interface IUserCreateCtrl {

}

class UserCreateCtrl extends BaseCreateCtrl {
    static $inject: string[] = ["$scope", "UserProfileResource"];

    constructor($scope: IUserCreateCtrlScope,
        UserProfileResource: IUserProfileResource) {
        super($scope, UserProfileResource);
        $scope.title = "Create User";
        $scope.isCreateMode = true;
    }
}

angular.module("app").controller("UserCreateCtrl", UserCreateCtrl);
