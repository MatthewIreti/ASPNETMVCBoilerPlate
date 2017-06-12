app.factory('AuthInterceptorSvc', [
    '$q', '$location', function ($q, $location) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if ($.cookie('token')) {
                    config.headers.Authorization = 'Bearer ' + $.cookie('token');
                }
                return config;
            }
        };
    }
]);
//# sourceMappingURL=AuthInterceptorSvc.js.map