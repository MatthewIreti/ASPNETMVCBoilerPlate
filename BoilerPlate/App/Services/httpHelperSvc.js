var httpHelperSvc = (function () {
    //greeting = "Hello";
    function httpHelperSvc($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }
    httpHelperSvc.prototype.process = function (config) {
        config = jQuery.extend({
            method: 'Get',
            params: {},
            data: {}
        }, config);
        var deferred = this.$q.defer();
        this.$http(config).success(function (response) {
            deferred.resolve(response);
        }).error(function (response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };
    httpHelperSvc.serviceId = "httpHelperSvc";
    return httpHelperSvc;
}());
// Update the app1 variable name to be that of your module variable
app.factory(httpHelperSvc.serviceId, ['$http', '$q', function ($http, $q) {
        return new httpHelperSvc($http, $q);
    }
]);
//# sourceMappingURL=httpHelperSvc.js.map