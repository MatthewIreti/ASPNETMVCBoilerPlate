app.directive('dropdownMultiselect', function () {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            options: '=',
            pre_selected: '=preSelected'
        },
        template: "<div class='dropdown' data-ng-class='{open: open}'  >" +
        "<button class='btn btn-default dropdown-toggle' type='button' data-ng-click='openDropdown()'>...Select... " +
        "<span class='caret'></span>"
        + "</button>" +
        "<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>" +
        "<li><a data-ng-click='selectAll()'><span class='glyphicon glyphicon-ok green'aria-hidden='true'></span> Check All</a></li>" +
        "<li><a data-ng-click='deselectAll();'><span class='glyphicon glyphicon-remove red'aria-hidden='true'></span> Uncheck All</a></li>" +
        "<li class='divider'></li>"
        + "<li data-ng-repeat='option in options'><a data-ng-click='toggleSelectItem(option)'><span data-ng-class='getClassName(option)' aria-hidden='true' ></span> {{option.name}}</a></li>" +
        "</ul>" +
        "</div>",
        controller:function($scope) {
            $scope.openDropdown = function () {
                $scope.open = !$scope.open;
                $scope.selectedItems = $scope.model;


            };
              
        }

    }
});

