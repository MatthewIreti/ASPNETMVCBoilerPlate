

    interface IFilter extends ng.IDirective {
    }

    interface IFilterScope extends ng.IScope {
      
        filterTemplate
    }

    interface IFilterAttributes extends ng.IAttributes {
        filter
    }

    filter.$inject = ["$window"];
    function filter($window: ng.IWindowService): IFilter {
        function link(scope: IFilterScope, element: ng.IAugmentedJQuery,
            attrs: IFilterAttributes) {
            scope.filterTemplate = attrs.filter;
        }

        return {
            restrict: "EA",
            link: link,
            templateUrl:"/app/directives/filter.html"
        };
    }

    angular.module("app").directive("filter", filter);
