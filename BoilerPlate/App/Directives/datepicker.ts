
app.directive('ccDatePicker', [
    "$parse", "$filter", ($parse: ng.IParseService, $filter: ng.IFilterService) => {

        return {
            scope: {
                ccObject: '=',
                ccModel:'='
            },
            restrict: 'AC',
            link: (scope: any, element, attrs) => {
                var model = scope.ccModel;
                var ready = false;
                var done = false;
                var modelSetter = $parse(model).assign;

                var data = $parse(model)(scope.ccObject);
                if (data && !done) {

                    var date1 = new Date(data);
                    if (date1.getFullYear() == 1)
                        date1 = new Date()
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

                $(element).change(() => {
                    var date = $(element).datepicker('getDate');
                    scope.$apply(() => {

                        if (date.getDate()) {
                            modelSetter(scope.ccObject, date);
                        } else {
                            modelSetter(scope.ccObject, "");
                        }
                    });
                });

            }
        };
    }
]);

 