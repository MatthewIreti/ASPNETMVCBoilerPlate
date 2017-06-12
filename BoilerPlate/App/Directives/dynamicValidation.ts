

interface IDynamicValidation extends ng.IDirective {
    
}

interface IDynamicValidationScope extends ng.IScope {
    dynamicValidation
}

class DynamicValidation implements IDynamicValidation {
    static directiveId: string = "dynamicValidation";
    restrict: string = "A";
    scope= {
        dynamicValidation: '='
    }

    constructor(private $window: ng.IWindowService) {
    }

    link = (scope: IDynamicValidationScope, element, attrs: ng.IAttributes) => {
        setTimeout(() => {
            $(element).closest('form').validate();
            $(element).rules('add', scope.dynamicValidation);
        }, 10);
    }
}

// Update the app1 variable name to be that of your module variable
app.directive(DynamicValidation.directiveId, ['$window', $window =>
    new DynamicValidation($window)
]);
