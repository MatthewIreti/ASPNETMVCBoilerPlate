

interface IWaiting extends ng.IDirective {
}

interface IWaitingScope extends ng.IScope {

}

class Waiting implements IWaiting {
    static directiveId: string = "waiting";
    restrict: string = "A";

    constructor(private $window: ng.IWindowService) {
    }

    link = (scope: IWaitingScope, element, attrs: ng.IAttributes) => {
        scope.$watch('waiting', newValue => {

            if (newValue >= 1) {

                $(element).waitMe({
                    effect: 'bounce',
                    text: '',
                    bg: 'rgba(255,255,255,0.7)',
                    color: '#000'
                });
            } else {
                $(element).waitMe('hide');
            }

        });
    }
}

// Update the app1 variable name to be that of your module variable
app.directive(Waiting.directiveId, ['$window', $window =>
    new Waiting($window)
]);
 