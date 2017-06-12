
interface IConstants {
    roles: {
        superAdmin: number;
        admin: number;
    }; 
}


function Constants(): IConstants {

    var service: IConstants = {
        roles: {
            superAdmin: 1,
            admin: 2 
        } 
    };
        return service;
    }
angular.module("app").factory("Constants",Constants);
