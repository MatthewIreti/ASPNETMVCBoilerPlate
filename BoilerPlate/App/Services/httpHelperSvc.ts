
interface IhttpHelperSvc {
   
    process(config)
}

class httpHelperSvc implements IhttpHelperSvc {
    static serviceId: string = "httpHelperSvc";

//greeting = "Hello";

    constructor(private $http: ng.IHttpService, private $q: ng.IQService) {
    }

    process(config:ng.IRequestConfig) {
      
        config = jQuery.extend({
            method: 'Get',
            params: {},
            data: {}
        }, config); 

        var deferred = this.$q.defer();
        this.$http(config).success(response=> {
           
            deferred.resolve(response);
        }).error(response=> {
            deferred.reject(response);
        });
        return deferred.promise;
    }

}

// Update the app1 variable name to be that of your module variable
app.factory(httpHelperSvc.serviceId, ['$http', '$q', ($http, $q) =>
    new httpHelperSvc($http, $q)
]);
