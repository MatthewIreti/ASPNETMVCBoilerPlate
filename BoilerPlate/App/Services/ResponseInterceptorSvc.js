app.factory('ResponseInterceptorSvc', ['$q', '$location',
    function ($q, $location) {
        return function (promise) {
            return promise.then(function (response) {
                return response;
            }, function (response) {
                switch (response.status) {
                    case 400:
                        // $state.go('Error500');
                        break;
                    case 404:
                        alert(JSON.stringify(response));
                        //   $location.path('/error_404');
                        break;
                    case 401:
                        if (localStorage.getItem('token')) {
                            localStorage.removeItem('token');
                        }
                        $location.path('/account/index');
                        break;
                    case 403:
                        break;
                    case 500:
                        if (response.data && response.data.exceptionMessage) {
                            alert(response.data.exceptionMessage);
                        }
                        else {
                            $location.path('/error_500');
                        }
                        break;
                    default:
                        break;
                }
                return $q.reject(response);
            });
        };
    }]);
//# sourceMappingURL=ResponseInterceptorSvc.js.map