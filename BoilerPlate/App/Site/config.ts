
app.config([
    "stateHelperProvider", "$urlRouterProvider",(stateHelperProvider: ng.ui.IStateProvider, $urlRouterProvider) => {
        $urlRouterProvider.otherwise('/users/index'); 
        var sitePath = "/App/site/";
        stateHelperProvider
            .state({
                name: "site.usermanagement",
                url: "/users",
                template: "<div ui-view>",
                children: [
                    {
                        name: "index",
                        url: "/index",
                        controller: "UserListCtrl",
                        templateUrl: sitePath + "/userprofile/list.html" 
                    },
                    {
                        name: "create",
                        url: "/create",
                        controller: "UserCreateCtrl",
                        templateUrl: sitePath + "/userprofile/form.html" 
                    },
                    {
                        name: "edit",
                        url: "/edit/:id",
                        controller: "UserEditCtrl",
                        templateUrl: sitePath + "/userprofile/form.html" 
                    },
                    {
                        name: "details",
                        url: "/details/:id",
                        controller: "UserDetailCtrl",
                        templateUrl: sitePath + "/userprofile/detail.html" 
                    }
                ]
            });

    }
]);
