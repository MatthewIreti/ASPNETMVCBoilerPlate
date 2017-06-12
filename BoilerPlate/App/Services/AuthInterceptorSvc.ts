app.factory('AuthInterceptorSvc', [
    '$q', '$location',  ($q, $location) => {
        return {
            request: config=> {

                config.headers = config.headers || {};
                if ($.cookie('token')) {
                    config.headers.Authorization = 'Bearer ' + $.cookie('token');
                }
                return config;
            }
        };
    }
]); 
 