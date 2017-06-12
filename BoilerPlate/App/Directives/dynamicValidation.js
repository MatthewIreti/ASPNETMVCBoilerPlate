var DynamicValidation = (function () {
    function DynamicValidation($window) {
        this.$window = $window;
        this.restrict = "A";
        this.scope = {
            dynamicValidation: '='
        };
        this.link = function (scope, element, attrs) {
            setTimeout(function () {
                $(element).closest('form').validate();
                $(element).rules('add', scope.dynamicValidation);
            }, 10);
        };
    }
    DynamicValidation.directiveId = "dynamicValidation";
    return DynamicValidation;
}());
// Update the app1 variable name to be that of your module variable
app.directive(DynamicValidation.directiveId, ['$window', function ($window) {
        return new DynamicValidation($window);
    }
]);
//# sourceMappingURL=dynamicValidation.js.map