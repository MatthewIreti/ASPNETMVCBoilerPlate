
    interface IRegistrationDtv extends ng.IDirective {
    }

    interface IRegistrationDtvScope extends ng.IScope {
    }

    interface IRegistrationDtvAttributes extends ng.IAttributes {
    }

    RegistrationDtv.$inject = ["$window"];
    function RegistrationDtv($window: ng.IWindowService): IRegistrationDtv {
        return {
            restrict: "EA",
            link: link,
            templateUrl:"/App/Directives/registrationDtv.html"
        }

        function link(scope: IRegistrationDtvScope, element: ng.IAugmentedJQuery,
            attrs: IRegistrationDtvAttributes) {
        }
    }

    angular.module("app").directive("registrationDtv", RegistrationDtv);
