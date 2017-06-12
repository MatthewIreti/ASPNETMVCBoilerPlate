angular.module("app").directive('focus', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(attrs.focus, function (newValue) {
                    if (newValue) {
                        $timeout(function () {
                            element[0].focus();
                        }, 100);
                    }
                });
                element.bind("blur", function (e) {
                    $timeout(function () {
                        scope.$apply(attrs.focus + "=false");
                    }, 10);
                });
                element.bind("focus", function (e) {
                    $timeout(function () {
                        scope.$apply(attrs.focus + "=true");
                    }, 10);
                });
            }
        };
    }]);
//# sourceMappingURL=myFocus.js.map