app.filter('mydate', ['$filter', function ($filter) {
        return function (input) {
            if (input == null) {
                return "";
            }
            var date = $filter('date')(new Date(input), 'MM/dd/yyyy');
            return date.toUpperCase();
        };
    }]);
//# sourceMappingURL=dateFtr.js.map