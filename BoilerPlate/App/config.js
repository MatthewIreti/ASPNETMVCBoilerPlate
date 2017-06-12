app.config([
    'stateHelperProvider', '$urlRouterProvider',
    '$httpProvider', '$locationProvider', function (stateHelperProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
        $urlRouterProvider.rule(function ($injector, $location) {
            var path = $location.path(), normalized = path.toLowerCase();
            if (path != normalized) {
                $location.replace().path(normalized);
            }
        });
        stateHelperProvider
            .state({
            name: 'site',
            abstract: true,
            template: '<div ui-view></div>',
        });
        $locationProvider.html5Mode(true);
        $httpProvider.responseInterceptors.push('ResponseInterceptorSvc');
        $httpProvider.interceptors.push('AuthInterceptorSvc');
    }
]);
//# sourceMappingURL=config.js.map