var BaseDetailCtrl = (function () {
    function BaseDetailCtrl($scope, Resource, backLink, config, $modalInstance) {
        var _this = this;
        this.$scope = $scope;
        this.Resource = Resource;
        this.backLink = backLink;
        this.config = config;
        this.$modalInstance = $modalInstance;
        $scope.breadcrumbs.splice(0, $scope.breadcrumbs.length);
        this.init();
        this.$scope.goBack = function () { return _this.goBack(); };
        this.$scope.backLink = {};
        this.$scope.closeModal = function () {
            $modalInstance.close();
        };
    }
    BaseDetailCtrl.prototype.reload = function () {
        var _this = this;
        this.$scope.waiting = 1;
        this.$promise = null;
        if (this.Resource.details)
            this.$promise = this.Resource.details(this.$scope.$stateParams).$promise;
        else
            this.$promise = this.Resource.get(this.$scope.$stateParams).$promise;
        this.$promise
            .then(function (data) {
            _this.$scope.item = data;
            _this.$scope.waiting--;
        });
    };
    BaseDetailCtrl.prototype.init = function () {
        var _this = this;
        this.$scope.$stateParams = $.extend(this.$scope.$stateParams, this.config);
        this.$scope.toggleActive = function () { return _this.toggleActive(); };
        this.$scope.deleteObject = function () { return _this.deleteObject(); };
        this.reload();
        this.$scope.submitForm = function () { return _this.submitForm(); };
        this.$scope.validationRule = {
            rules: {},
            messages: {}
        };
        this.$scope.handleError = function (response) { return _this.handleError(response); };
    };
    BaseDetailCtrl.prototype.deleteObject = function () {
        var _this = this;
        if (window.confirm("Continue delete?")) {
            this.$scope.waiting++;
            this.Resource.delete(this.$scope.item).$promise.then(function () {
                _this.$scope.waiting--;
                alert("Deleted successfully!");
                _this.$scope.$state.go(_this.backLink.forwardLink, _this.$scope.$stateParams);
            }, function (response) {
                _this.$scope.waiting--;
            });
        }
    };
    BaseDetailCtrl.prototype.submitForm = function () {
        this.$scope.waiting++;
        var promise;
    };
    BaseDetailCtrl.prototype.goBack = function (forward, data) {
        this.$scope.$state.go(this.$scope.backLink.forwardLink || this.$scope.backLink.state, $.extend({}, this.$scope.$stateParams, this.config, this.$scope.item));
    };
    BaseDetailCtrl.prototype.toggleActive = function () {
        var _this = this;
        this.$scope.waiting++;
        this.Resource.toggleActive(this.$scope.item).$promise.
            then(function (data) {
            _this.$scope.item = data;
            _this.$scope.waiting--;
            alert("Action successful");
        }, function (response) {
            _this.$scope.waiting--;
            alert("Error occured");
        });
    };
    BaseDetailCtrl.prototype.handleError = function (response) {
        this.$scope.errors = [];
        this.$scope.errors = this.$scope.errorHandle.handleError(response);
        this.$scope.waiting = 0;
    };
    return BaseDetailCtrl;
}());
angular.module("app").controller("BaseDetailCtrl", BaseDetailCtrl);
//# sourceMappingURL=BaseDetailCtrl.js.map