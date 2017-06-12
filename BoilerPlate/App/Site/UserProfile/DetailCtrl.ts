

interface IUserDetailCtrlScope extends IBaseDetailCtrlScope {
    item;
    waiting;
    toggleActive;
}

interface IUserDetailCtrl {

}

class UserDetailCtrl extends BaseDetailCtrl {
    static $inject: string[] = ["$scope", "UserProfileResource"];
     

    constructor($scope: IUserDetailCtrlScope,
        UserProfileResource: IUserProfileResource) {
        super($scope, UserProfileResource, "site.index");
        this.$scope.backLink.state = "site.usermanagement.index";
        this.$scope.title = "Details";
        this.$scope.breadcrumbs.push(
            { title: "Home", link: "site.home" },
            { title: "Administrators ", link: "site.usermanagement.index" },
            { title: "Details" });
         
    }
}

angular.module("app").controller("UserDetailCtrl", UserDetailCtrl);
