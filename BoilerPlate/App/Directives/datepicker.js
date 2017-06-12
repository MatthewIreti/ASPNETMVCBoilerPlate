app.directive('ccDatePicker', [
    "$parse", "$filter", function ($parse, $filter) {
        return {
            scope: {
                ccObject: '=',
                ccModel: '='
            },
            restrict: 'AC',
            link: function (scope, element, attrs) {
                var model = scope.ccModel;
                var ready = false;
                var done = false;
                var modelSetter = $parse(model).assign;
                var data = $parse(model)(scope.ccObject);
                if (data && !done) {
                    var date1 = new Date(data);
                    if (date1.getFullYear() == 1)
                        date1 = new Date();
                    var dateString = $filter('date')(date1, 'dd/MM/yyyy');
                    if (date1.getDate()) {
                        $(element).val(dateString);
                        modelSetter(scope.ccObject, date1);
                    }
                }
                $(element).datepicker({
                    weekStart: 1,
                    todayHighlight: true,
                    format: "dd/mm/yyyy",
                    orientation: "left",
                    autoclose: true
                });
                $(element).change(function () {
                    var date = $(element).datepicker('getDate');
                    scope.$apply(function () {
                        if (date.getDate()) {
                            modelSetter(scope.ccObject, date);
                        }
                        else {
                            modelSetter(scope.ccObject, "");
                        }
                    });
                });
            }
        };
    }
]);
//# sourceMappingURL=datepicker.js.map