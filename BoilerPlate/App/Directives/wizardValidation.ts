interface IWizardValidationRule {
    rules: any;
    messages: any;

}
interface IWizardValidationScope extends ng.IScope {
    submitForm();
    validationRule: IWizardValidationRule;
    waiting;
    errors: string[];
    wizard;
    previousStep;
    nextStep;
    goToStup
}

class WizardValidation implements ng.IDirective {
    static directiveId: string = "validationWizard";
    restrict: string = "A";

    constructor(private $window: ng.IWindowService, private $timeout: ng.ITimeoutService) {

    }

    link = (scope: IWizardValidationScope, element, attrs) => {

        var $form2 = jQuery(element).find('form');
        $form2.on('keyup keypress', e => {
            var code = e.keyCode || e.which;

            if (code === 13) {
                e.preventDefault();
                return false;
            }
        });

        // Init form validation on the other wizard form
        var $validator2 = $form2.validate($.extend({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            invalidHandler: (event, validator) => { //display error alert on form submit   
                $('.alert-danger', $(element)).show();
            },

            highlight: e=> { // hightlight error inputs
                if ($(e).closest('.form-group').length)
                    $(e).closest('.form-group').addClass('has-error'); // set error class to the control group
                else
                    $(e).closest('div').addClass('has-error');
            },

            success: label=> {
                if (label.closest('.form-group').length)
                    label.closest('.form-group').removeClass('has-error');
                else {
                    label.closest('div').removeClass('has-error');
                }
                label.remove();
            },

            errorPlacement: (error, e) => {
                if ($(e).parent('label').length) { // insert checkbox errors after the container     
                    error.insertAfter($(e).parent('label'));
                } else if (element.closest('.input-icon').size() === 1) {
                    error.insertAfter(e.closest('.input-icon'));
                } else {
                    error.insertAfter(e);
                }
            },

            submitHandler: form=> {
                scope.$apply(() => {

                    scope.submitForm();

                });
            }
        },
            scope.validationRule));

        // Init wizard with validation
        jQuery(element).find('.js-wizard-validation').bootstrapWizard({
            'tabClass': '',
            'previousSelector': '.wizard-prev',
            'nextSelector': '.wizard-next',
            'onTabShow': function ($tab, $nav, $index) {
               
                var $total = $nav.find('li').length;
                var $current = $index + 1;
                
                // Get vital wizard elements
                var $wizard = $nav.parents('.js-wizard-validation');
                var $btnNext = $wizard.find('.wizard-next');
                var $btnFinish = $wizard.find('.wizard-finish');
                // If it's the last tab then hide the last button and show the finish instead
                if ($current >= $total) {
                    $btnNext.hide();
                    $btnFinish.show();
                } else {
                    $btnNext.show();
                    $btnFinish.hide();
                }
                scope.$broadcast('wizardTabChanged', $current);
                
            },
            'onNext'($tab, $navigation, $index) {
                var $valid = $form2.valid();

                if (!$valid) {
                    $validator2.focusInvalid();

                    return false;
                }
            },
            onTabClick($tab, $navigation, $index) {
                return false;
            }
        });

    }
}

// Update the app1 variable name to be that of your module variable
app.directive(WizardValidation.directiveId, ['$window', "$timeout", ($window, $timeout) =>
    new WizardValidation($window, $timeout)
]);
