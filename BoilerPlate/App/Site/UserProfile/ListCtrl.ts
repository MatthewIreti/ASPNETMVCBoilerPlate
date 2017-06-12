
﻿interface IUserListCtrlScope extends IListCtrlScope {
    
﻿}


class UserListCtrl extends BaseListCtrl {
    static $inject: string[] = ["$scope", "UserProfileResource"];
    locaScope: IUserListCtrlScope;
    localResource: IUserProfileResource;

    constructor($scope: IUserListCtrlScope,
        UserProfileResource: IUserProfileResource) {
        super($scope, UserProfileResource); 
        this.locaScope = $scope;
        this.localResource = UserProfileResource;
        
        $scope.title = "Users"; 

        this.$scope.breadcrumbs.push(
        { title: "Home", link: "site.home" },
        { title: this.$scope.title });
        this.init();
    }
     
}
angular.module("app").controller("UserListCtrl", UserListCtrl);