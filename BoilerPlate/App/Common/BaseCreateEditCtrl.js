var BaseCreateEditCtrl = (function () {
    function BaseCreateEditCtrl($scope, Resource, Item, config) {
        var _this = this;
        this.$scope = $scope;
        this.Resource = Resource;
        this.Item = Item;
        $scope.breadcrumbs.splice(0, $scope.breadcrumbs.length);
        this.config = $.extend($scope.$stateParams, config);
        $scope.backLink = {};
        this.$scope.openDate = function ($event, property) {
            $event.preventDefault();
            $event.stopPropagation();
            _this.$scope.opened[property] = true;
        };
        this.$scope.processFile = false;
        this.$scope.formId = "";
        this.$scope.opened = {};
        $scope.goBack = function () { return _this.goBack(); };
        $scope.submitForm = function () { return _this.submitForm(); };
        $scope.reloadForm = function () { return _this.reloadForm(); };
        $scope.item = {};
        $scope.waiting = 1;
        if (this instanceof BaseEditCtrl) {
            this.$scope.item = Resource.get(this.config);
            this.$scope.item.$promise.then(function (data) {
                // this.$scope.item = data;
                _this.$scope.waiting--;
            });
        }
        else {
            $scope.item = new Item(this.config);
            $scope.waiting--;
        }
        $scope.stepUpWait = function () { return _this.stepUpWait(); };
        $scope.stepDownWait = function () { return _this.stepDownWait(); };
    }
    BaseCreateEditCtrl.prototype.stepUpWait = function () {
        this.$scope.waiting++;
    };
    BaseCreateEditCtrl.prototype.stepDownWait = function () {
        this.$scope.waiting--;
    };
    BaseCreateEditCtrl.prototype.submitForm = function () {
        var _this = this;
        this.$scope.waiting++;
        if (this instanceof BaseEditCtrl) {
            this.Resource.update(this.$scope.item).$promise.then(function (data) {
                alert("Updated successfully");
                _this.goBack(true, data);
            }, function (response) {
                alert("There was an error updating the information");
                _this.handleError(response);
            });
        }
        else {
            this.$scope.item.$save(function (data) {
                alert("Saved successfully");
                _this.goBack(true, data);
            }, function (response) {
                alert("There was an error saving the information");
                _this.handleError(response);
            });
        }
    };
    BaseCreateEditCtrl.prototype.handleError = function (response) {
        this.$scope.errors = [];
        this.$scope.errors = this.$scope.errorHandle.handleError(response);
        this.$scope.waiting = 0;
    };
    BaseCreateEditCtrl.prototype.reloadForm = function () {
        var _this = this;
        this.$scope.errors = [];
        this.$scope.waiting++;
        if (this instanceof BaseEditCtrl) {
            this.$scope.item = this.Resource.get(this.config);
            this.$scope.item.$promise.then(function () {
                _this.$scope.waiting--;
            });
        }
        else {
            this.$scope.item = new this.Item(this.config);
            this.$scope.waiting--;
        }
    };
    BaseCreateEditCtrl.prototype.goBack = function (forward, data) {
        this.$scope.$state.go(forward ? this.$scope.backLink.forwardLink : this.$scope.backLink.state, $.extend({}, this.$scope.$stateParams, this.config, data));
    };
    return BaseCreateEditCtrl;
}());
//# sourceMappingURL=BaseCreateEditCtrl.js.map