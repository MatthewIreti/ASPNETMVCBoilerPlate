var UserFormCtrl = (function () {
    function UserFormCtrl($scope, UserProfileResource) {
        this.$scope = $scope;
        $scope.backLink.state = "site.usermanagement.index";
        $scope.backLink.forwardLink = "site.usermanagement.index";
        $scope.validationRule = {
            rules: {
                emailAddress: {
                    required: true,
                    email: true
                },
                username: {
                    required: true
                },
                firstName: {
                    required: true
                },
                lastName: {
                    required: true
                },
                address: {
                    required: true
                },
                phoneNumber: {
                    digits: true,
                    required: true,
                    minlength: 11,
                    maxlength: 11
                }
            },
            messages: {}
        };
        $scope.roles = UserProfileResource.getRolesNameAndId();
        this.$scope.breadcrumbs.push({ title: "Home", link: "site.home" }, { title: "Administrators", link: $scope.backLink.state }, { title: $scope.title });
    }
    UserFormCtrl.$inject = ["$scope", "UserProfileResource"];
    return UserFormCtrl;
}());
angular.module("app").controller("UserFormCtrl", UserFormCtrl);
//# sourceMappingURL=FormCtrl.js.map