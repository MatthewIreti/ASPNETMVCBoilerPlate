angular.module("app").run([
    '$rootScope', '$state', '$stateParams', 'errorHandle', "UserProfileResource",
    function ($rootScope, $state, $stateParams, errorHandle, UserProfileResource) {
        $rootScope.currentUserInfo = UserProfileResource.getCurrentUserInfo();
        $rootScope.$state = $state; // state to be accessed from view
        $rootScope.$stateParams = $stateParams;
        $rootScope.errorHandle = errorHandle;
        $rootScope.goToState = function (index) {
            if (!$rootScope.breadcrumbs[index].link)
                return;
            var config = $rootScope.breadcrumbs[index].config || $stateParams;
            $state.go($rootScope.breadcrumbs[index].link, config);
        };
        $rootScope.breadcrumbs = [];
        $rootScope.statusList = [
            { value: true, name: "Enabled" },
            { value: false, name: 'Disabled' }
        ];
        $rootScope.yesNoList = [
            { value: true, name: "Yes" },
            { value: false, name: 'No' }
        ];
        $rootScope.goToState = function (index) {
            var link = $rootScope.breadcrumbs[index];
            $state.go(link.link, (link.config || $stateParams));
        };
    }
]);
//# sourceMappingURL=bootStrap.js.map