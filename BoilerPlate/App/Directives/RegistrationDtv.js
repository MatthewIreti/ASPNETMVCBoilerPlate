RegistrationDtv.$inject = ["$window"];
function RegistrationDtv($window) {
    return {
        restrict: "EA",
        link: link,
        templateUrl: "/App/Directives/registrationDtv.html"
    };
    function link(scope, element, attrs) {
    }
}
angular.module("app").directive("registrationDtv", RegistrationDtv);
//# sourceMappingURL=RegistrationDtv.js.map