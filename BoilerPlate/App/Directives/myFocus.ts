angular.module("app").directive('focus', ['$timeout', $timeout => {
    return {
        restrict: 'A',
        link(scope, element, attrs) {
            scope.$watch(attrs.focus, newValue => {
                if (newValue) {
                    $timeout(() => {
                        element[0].focus();
                    }, 100);
                }
            });
            element.bind("blur", e => {
                $timeout(() => {
                    scope.$apply(attrs.focus + "=false");
                }, 10);
            });
            element.bind("focus", e => {
                $timeout(() => {
                    scope.$apply(attrs.focus + "=true");
                }, 10);
            });
        }
    }
}]);