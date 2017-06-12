var BaseListCtrl = (function () {
    function BaseListCtrl($scope, Resource, config) {
        var _this = this;
        this.$scope = $scope;
        this.Resource = Resource;
        this.config = config;
        $scope.breadcrumbs.splice(0, $scope.breadcrumbs.length);
        this.$scope.waiting = 0;
        this.$scope.orderByExpression = { column: 1, direction: 1 };
        this.$scope.filter = {};
        this.$scope.toggleActive = function (item) { return _this.toggleActive(item); };
        this.$scope.goBack = function () { return _this.goBack(); };
        this.$scope.backLink = {};
    }
    BaseListCtrl.prototype.toggleActive = function (item) {
        var _this = this;
        this.$scope.notification.bootBoxConfirm("Are sure you ?", function () {
            _this.$scope.waiting++;
            _this.Resource.toggleActive(item).$promise.
                then(function (data) {
                _this.$scope.waiting--;
                _this.$scope.setupPagination();
                alert("Action successful!");
            }, function (response) {
                alert("Error occured while performing the action");
                _this.$scope.waiting--;
            });
        });
    };
    BaseListCtrl.prototype.resetFiltering = function () {
        this.$scope.filter = {};
        this.setupPagination();
    };
    BaseListCtrl.prototype.init = function () {
        this.initScope();
        this.setupPagination();
        this.bindScopeMethods();
    };
    BaseListCtrl.prototype.initScope = function () {
        var _this = this;
        this.$scope.openDate = function ($event, property) {
            $event.preventDefault();
            $event.stopPropagation();
            _this.$scope.opened[property] = true;
        };
        this.$scope.opened = {};
        this.$scope.filterIsClosed = true;
        this.$scope.page = 1;
        this.$scope.paginationConfig = {
            count: 10,
            page: 1,
            total: 0
        };
        this.$scope.openCalender = function ($event, openOption) {
            $event.preventDefault();
            $event.stopPropagation();
            _this.$scope[openOption] = true;
        };
        this.$scope.waiting = 0;
        this.$scope.pager = { page: 1 };
        this.$scope.setupPagination = function () { return _this.setupPagination(); };
        this.$scope.getTotalPages = function () { return _this.getTotalPages(); };
        this.$scope.resetFiltering = function () { return _this.resetFiltering(); };
        this.$scope.getPageInfoDescription = function () { return _this.getPageInfoDescription(); };
        this.$scope.getCheckedItems = function () { return _this.getCheckedItems(); };
        this.$scope.checkAll = function () { return _this.checkAll(); };
        this.$scope.submitOptionSelection = function () { return _this.submitOptionSelection(); };
        this.$scope.orderExpressionChanged = function () { return _this.orderExpressionChanged(); };
        this.$scope.selectedIds = [];
    };
    BaseListCtrl.prototype.submitOptionSelection = function () {
        var _this = this;
        if (!this.$scope.selectedOption) {
            this.$scope.addAlert({ msg: "Please select an action", type: 'danger' });
            return false;
        }
        var ids = [];
        for (var i = 0; i < this.$scope.items.length; i++) {
            if (this.$scope.items[i].selected) {
                ids.push(this.$scope.items[i].id);
            }
        }
        if (!ids.length) {
            this.$scope.addAlert({ msg: " No record selected", type: 'danger' });
            alert("No record selected");
            return false;
        }
        if (this.$scope.selectedOption == 1) {
            var c = confirm("Continue delete?");
            if (c) {
                this.Resource.deleteAll({ ids: ids }).$promise.then(function () {
                    _this.setupPagination();
                    alert("Item(s) deleted successfully!");
                }, function () {
                });
            }
        }
    };
    BaseListCtrl.prototype.getCheckedItems = function () {
        var checked = 0;
        this.$scope.selectedIds = [];
        if (this.$scope.items) {
            for (var i = 0; i < this.$scope.items.length; i++) {
                if (this.$scope.items[i].selected) {
                    checked++;
                    this.$scope.selectedIds.push(this.$scope.items[i].id);
                }
            }
        }
        return checked;
    };
    BaseListCtrl.prototype.checkAll = function () {
        var _this = this;
        angular.forEach(this.$scope.items, function (item) {
            item.selected = !_this.$scope.selectedAll;
        });
    };
    BaseListCtrl.prototype.toggleSelectItem = function (index) {
        this.$scope.items[index].selected = !this.$scope.items[index].selected;
    };
    BaseListCtrl.prototype.getIndexSeed = function ($index) {
        return (this.$scope.pager.page - 1) * this.$scope.paginationConfig.count + $index + 1;
    };
    BaseListCtrl.prototype.getPageInfoDescription = function () {
        if (this.$scope.items) {
            return "Showing " + (this.$scope.paginationConfig.count * (this.$scope.pager.page - 1) + 1) + " to " +
                (this.$scope.paginationConfig.count * (this.$scope.pager.page - 1)
                    + this.$scope.items.length) + " of " + this.$scope.paginationConfig.total;
        }
        return "";
    };
    BaseListCtrl.prototype.getTotalPages = function () {
        return Math.ceil(this.$scope.paginationConfig.total / this.$scope.paginationConfig.count);
    };
    BaseListCtrl.prototype.bindScopeMethods = function () {
        var _this = this;
        this.$scope.pageChanged = function () { return _this.pageChanged(); };
        this.$scope.deleteObject = function (item) { return _this.deleteObject(item); };
        this.$scope.reloadPage = function () { return _this.reloadPage(); };
        this.$scope.getIndexSeed = function (index) { return _this.getIndexSeed(index); };
    };
    BaseListCtrl.prototype.setupPagination = function () {
        var _this = this;
        this.$scope.waiting++;
        this.Resource.count($.extend({
            count: this.$scope.paginationConfig.count,
            page: this.$scope.paginationConfig.page,
            orderByExpression: this.$scope.orderByExpression,
            whereCondition: JSON.stringify(this.$scope.filter)
        }, this.$scope.$stateParams, this.config, this.$scope.filter)).$promise.then(function (data) {
            _this.$scope.waiting--;
            _this.$scope.paginationConfig.total = data.total;
            _this.$scope.items = data.items;
            _this.$scope.hideFilter = false;
            if (data.otherInfo) {
                _this.$scope.reportSummary = data.otherInfo;
            }
        });
    };
    BaseListCtrl.prototype.pageChanged = function () {
        var _this = this;
        this.$scope.waiting++;
        this.Resource.query($.extend({
            count: this.$scope.paginationConfig.count,
            page: this.$scope.paginationConfig.page,
            orderByExpression: this.$scope.orderByExpression,
            whereCondition: JSON.stringify(this.$scope.filter)
        }, this.$scope.$stateParams, this.config, this.$scope.filter)).$promise.then(function (data) {
            _this.$scope.items = data;
            _this.$scope.pager.page = _this.$scope.paginationConfig.page;
            _this.$scope.waiting--;
            if (data.otherInfo) {
                _this.$scope.reportSummary = data.otherInfo;
            }
        }, function (data) {
            _this.$scope.waiting--;
        });
    };
    BaseListCtrl.prototype.deleteObject = function (item) {
        var _this = this;
        if (confirm("Are sure you want to delete the item?")) {
            this.$scope.waiting++;
            this.Resource.delete(item).$promise.then(function () {
                _this.$scope.waiting--;
                alert("Item was successfully deleted");
                _this.setupPagination();
            }, function (response) {
                alert(response.data.message);
                _this.$scope.waiting--;
            });
        }
    };
    BaseListCtrl.prototype.reloadPage = function () {
        this.$scope.$state.reload();
    };
    BaseListCtrl.prototype.orderExpressionChanged = function () {
        if (this.$scope.order.column && this.$scope.order.direction) {
            this.$scope.orderByExpression = this.$scope.order.column + " " + this.$scope.order.direction;
            this.pageChanged();
        }
        else
            this.$scope.orderByExpression = null;
    };
    BaseListCtrl.prototype.goBack = function (forward, data) {
        this.$scope.$state.go(this.$scope.backLink.forwardLink || this.$scope.backLink.state, $.extend({}, this.$scope.$stateParams, this.config, this.$scope.item));
    };
    return BaseListCtrl;
}());
//# sourceMappingURL=BaseListCtrl.js.map