/***
GLobal Directives
***/
// Route State Load Spinner(used on page or content load)
//var Layout;
app.directive('ngSpinnerBar', ['$rootScope',
    function ($rootScope) {
        return {
            restrict: "C",
            link: function ($scope, element, attrs) {
                element.addClass('hide'); // hide spinner bar by default
                $rootScope.$on('$stateChangeStart', function () {
                    element.removeClass('hide'); // show spinner bar 
                });
                $rootScope.$on('$stateChangeSuccess', function () {
                    $rootScope.breadcrumbs = [];
                    element.addClass('hide');
                });
                $rootScope.$on('$stateNotFound', function () {
                    element.addClass('hide'); // hide spinner bar
                });
                $rootScope.$on('$stateChangeError', function () {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
]);
// Handle global LINK click
app.directive('a', function () {
    return {
        restrict: 'E',
        link: function (scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function (e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});
// Handle Dropdown Hover Plugin Integration
app.directive('dropdownMenuHover', function () {
    return {
        link: function (scope, elem) {
            elem.dropdownHover();
        }
    };
});
var Export = (function () {
    function Export($window, $parse) {
        this.$window = $window;
        this.$parse = $parse;
        this.restrict = "C";
        this.link = function ($scope, elm, attr) {
            $scope.$on('export-pdf', function (e, d) {
                elm.tableExport({
                    type: 'pdf',
                    pdfFontSize: '7',
                    escape: 'false'
                });
            });
            $scope.$on('export-excel', function (e, d) {
                alert('sol');
                elm.tableExport({
                    type: 'excel',
                    escape: false
                });
            });
            $scope.$on('export-doc', function (e, d) {
                elm.tableExport({
                    type: 'doc',
                    escape: false
                });
            });
            $scope.$on('export-xml', function (e, d) {
                elm.tableExport({
                    type: 'xml',
                    escape: false
                });
            });
            $scope.$on('export-csv', function (e, d) {
                elm.tableExport({
                    type: 'csv',
                    escape: false
                });
            });
            $scope.$on('export-txt', function (e, d) {
                elm.tableExport({
                    type: 'txt',
                    escape: false
                });
            });
            $scope.$on('export-json', function (e, d) {
                elm.tableExport({
                    type: 'json',
                    escape: false
                });
            });
            $scope.$on('export-png', function (e, d) {
                elm.tableExport({
                    type: 'png',
                    escape: false
                });
            });
        };
    }
    Export.directiveId = "exportTable";
    return Export;
}());
app.directive(Export.directiveId, ['$window', '$parse', function ($window, $parse) {
        return new Export($window, $parse);
    }
]);
//# sourceMappingURL=appDirectives.js.map