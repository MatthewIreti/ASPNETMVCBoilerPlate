app.filter('string', ['$filter', function ($filter) {
        return function (input) {
            return input ? input : "NA";
        };
    }]);
app.filter('isActive', ['$filter', function ($filter) {
        return function (input) {
            return input ? "Enabled" : "Disabled";
        };
    }]);
app.filter('yesNo', ['$filter', function ($filter) {
        return function (input) {
            return input ? "Yes" : "No";
        };
    }]);
app.filter('status', ['$filter', function ($filter) {
        return function (input) {
            return input ? "&#10004" : "&#10006";
        };
    }]);
app.filter('mydate', ['$filter', function ($filter) {
        return function (input) {
            if (input == null) {
                return "";
            }
            var date = $filter('date')(new Date(input), 'MM/dd/yyyy');
            return date.toUpperCase();
        };
    }]);
app.filter('trustedAudioUrl', function ($sce) {
    return function (path, audioFile) {
        return $sce.trustAsResourceUrl(path + audioFile);
    };
});
app.filter('trustedHtml', function ($sce) {
    return function (html) {
        return $sce.trustAsHtml(html);
    };
});
app.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];
        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;
                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }
                if (itemMatches) {
                    out.push(item);
                }
            });
        }
        else {
            // Let the output be the input untouched
            out = items;
        }
        return out;
    };
});
app.filter('UserNameFromList', ['$filter', function ($filter) {
        return function (input) {
            var names = input.map(function (d) {
                return d.firstName + " " + d.lastName;
            });
            return names.join("; ");
        };
    }]);
app.filter('availableNA', ['$filter', function ($filter) {
        return function (input, param) {
            return input ? input : param || "N/A";
        };
    }]);
app.filter('processMonth', ['$filter', function ($filter) {
        return function (input) {
            return [
                { name: "January", value: 1 },
                { name: "February", value: 2 },
                { name: "March", value: 3 },
                { name: "April", value: 4 },
                { name: "May", value: 5 },
                { name: "June", value: 6 },
                { name: "July", value: 7 },
                { name: "August", value: 8 },
                { name: "September", value: 9 },
                { name: "October", value: 10 },
                { name: "November", value: 11 },
                { name: "December", value: 12 }
            ].filter(function (item) {
                return item.value == input;
            })[0].name;
        };
    }]);
app.filter('areaConverssion', [
    '$filter', function ($filter) {
        return function (input) {
            if (input == null) {
                return '0';
            }
            var request = parseFloat(input);
            var result = request;
            var isHecter = request / 10000;
            if (isHecter >= 1)
                result = isHecter;
            var response = $filter('number')(result);
            return response + (isHecter < 1 ? " sq.mt." : " HA");
        };
    }
]);
//# sourceMappingURL=appFilters.js.map