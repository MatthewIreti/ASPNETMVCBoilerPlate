app.filter('mydate', ['$filter',  ($filter)=> {
    return  (input)=> {
        if (input == null) { return ""; }
        var date = $filter('date')(new Date(input), 'MM/dd/yyyy');
        return date.toUpperCase();
    };
}]);