/***
GLobal Directives
***/

// Route State Load Spinner(used on page or content load)
//var Layout;

app.directive('ngSpinnerBar', ['$rootScope', 
    function ($rootScope:IRootScope) {

        return {
            restrict:"C",
            link: function ($scope:IRootScope, element, attrs) {
                
                element.addClass('hide'); // hide spinner bar by default

                $rootScope.$on('$stateChangeStart', ()=> {
                    element.removeClass('hide'); // show spinner bar 
                });
                $rootScope.$on('$stateChangeSuccess', () => {
                    $rootScope.breadcrumbs = [];
                    element.addClass('hide'); 
                    
                });

                $rootScope.$on('$stateNotFound', function () {
                    element.addClass('hide'); // hide spinner bar
                });

                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
]);

// Handle global LINK click
app.directive('a',
    function () {
        return {
            restrict: 'E',
            link: function (scope, elem, attrs:any) {
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
        link: function (scope, elem:any) {
            elem.dropdownHover();
        }
    };
});
interface IExportScope extends ng.IScope {

}

class Export implements ng.IDirective {
    static directiveId: string = "exportTable";
    restrict: string = "C";



    constructor(private $window: ng.IWindowService, private $parse: ng.IParseService) {

    }

    link = function ($scope: IExportScope, elm, attr) {

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
    }
}

app.directive(Export.directiveId, ['$window', '$parse', ($window, $parse) =>
    new Export($window, $parse)
]);

