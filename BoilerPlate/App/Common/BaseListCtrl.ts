
interface IHeaderButton {
    type: string;
    title: string;
    link: string;
    icon: string;
}

interface IListCtrlScope extends IRootScope {
    headerBottons: IHeaderButton[]; 
    items: IRootObject[];
    filter: any;
    waiting: number;
    item: IRootObject;
    page: number;
    itemsPerPage: number; 
    selectedIdexes: number[];
    checkAll();
    selectedOption;
    goBack();
    backLink: IBackLink;
    setupPagination();
    getIndexSeed(index: number);
    getTotalPages;
    getPageInfoDescription(); 
    selectedAll;
    selectedIds; 
    deleteObject(item: IRootObject);
    editObject(item: IRootObject);
    reloadPage(); 
    resetFiltering();
    getCheckedItems();
    submitOptionSelection();
    openCalender(event: Event, name: string);
    pager;
    changePage: () => void;
    paginationConfig: { count: number;page: number;total: number };
    pageChanged: () => void;
    order: { column?; direction? };
    orderExpressionChanged: () => void;
    orderByExpression: {};
    whereCondition: string;
    filterIsClosed;
    opened;
    openDate; 
    toggleActive;
    title: string;
    hideFilter;  
    reportSummary;
    addAlert(p: { msg: string;type: string });
    breadcrumbs;
}


class BaseListCtrl {
    createLink: string;
    editLink: string;

    constructor(public $scope: IListCtrlScope,
        public Resource: IRootResource<IRootObject>, public config?) {
        $scope.breadcrumbs.splice(0, $scope.breadcrumbs.length);
        this.$scope.waiting = 0;
        this.$scope.orderByExpression = { column: 1, direction: 1 };
        this.$scope.filter = {};
        this.$scope.toggleActive = (item) => this.toggleActive(item);
        this.$scope.goBack = () => this.goBack();
        this.$scope.backLink = {}; 
    }

    toggleActive(item) {
        this.$scope.notification.bootBoxConfirm("Are sure you ?", () => {
            this.$scope.waiting++;
            this.Resource.toggleActive(item).$promise.
                then((data) => {
                    this.$scope.waiting--;
                    this.$scope.setupPagination();
                    alert("Action successful!");
                }, (response) => {
                    alert("Error occured while performing the action");
                    this.$scope.waiting--;
                });
        });
    }
     
    resetFiltering() {
        this.$scope.filter = {};
        this.setupPagination();
    }
    init() {
        this.initScope();
        this.setupPagination();
        this.bindScopeMethods();
    }
    initScope() {
        this.$scope.openDate = ($event, property: string)=> {
            $event.preventDefault();
            $event.stopPropagation();
            this.$scope.opened[property] = true;
        }; 
        this.$scope.opened = {};
        
        this.$scope.filterIsClosed = true;
        
        this.$scope.page = 1;
        this.$scope.paginationConfig = {
            count: 10,
            page: 1,
            total: 0
        };
         
        this.$scope.openCalender = ($event: Event, openOption) => {
            $event.preventDefault();
            $event.stopPropagation();
            this.$scope[openOption] = true;
        };
        this.$scope.waiting = 0;

        this.$scope.pager = { page: 1 };

        this.$scope.setupPagination = () => this.setupPagination();
        this.$scope.getTotalPages = () => this.getTotalPages();
        this.$scope.resetFiltering = () => this.resetFiltering();
        this.$scope.getPageInfoDescription = ()=> this.getPageInfoDescription();
        this.$scope.getCheckedItems = () => this.getCheckedItems();
        this.$scope.checkAll = () => this.checkAll();
        this.$scope.submitOptionSelection = () => this.submitOptionSelection();
       
        this.$scope.orderExpressionChanged = () => this.orderExpressionChanged();
        this.$scope.selectedIds = [];
    }

    submitOptionSelection(): any {
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
                this.Resource.deleteAll({ ids: ids }).$promise.then(() => {
                    this.setupPagination();
                    alert("Item(s) deleted successfully!");
                }, () => {
                    
                });
            }
        }
    }

    getCheckedItems() {
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
    }
    
    checkAll() {
        angular.forEach(this.$scope.items, (item) => {
            item.selected = !this.$scope.selectedAll;
        });
    }
    toggleSelectItem(index?) {
        this.$scope.items[index].selected = !this.$scope.items[index].selected;
    }    
    getIndexSeed($index: number) {
        return (this.$scope.pager.page - 1) * this.$scope.paginationConfig.count + $index + 1;
    }

    getPageInfoDescription() {
        if (this.$scope.items) {
            return "Showing " + (this.$scope.paginationConfig.count * (this.$scope.pager.page - 1) + 1) + " to " +
        (this.$scope.paginationConfig.count * (this.$scope.pager.page - 1)
            + this.$scope.items.length) + " of " + this.$scope.paginationConfig.total;
        }
        return "";
    }

    getTotalPages() {
        return Math.ceil(this.$scope.paginationConfig.total / this.$scope.paginationConfig.count);
    }

    bindScopeMethods() {
        
        this.$scope.pageChanged = () => this.pageChanged();
        this.$scope.deleteObject = (item) => this.deleteObject(item);
        this.$scope.reloadPage = () => this.reloadPage();
        this.$scope.getIndexSeed = (index) => this.getIndexSeed(index);
    }

    setupPagination() {
        this.$scope.waiting++;
         
        this.Resource.count($.extend({
                count: this.$scope.paginationConfig.count,
                page: this.$scope.paginationConfig.page ,
                orderByExpression: this.$scope.orderByExpression,
                whereCondition: JSON.stringify(this.$scope.filter)
            }, this.$scope.$stateParams,
            this.config, this.$scope.filter)).$promise.then((data) => {
          
            this.$scope.waiting--;
            this.$scope.paginationConfig.total = data.total;
            this.$scope.items = data.items;
            this.$scope.hideFilter = false;
            if (data.otherInfo) {
                    this.$scope.reportSummary = data.otherInfo;
                } 
        });
    }
    pageChanged() {
       
        this.$scope.waiting++;
   
        this.Resource.query($.extend({
            count: this.$scope.paginationConfig.count,
            page: this.$scope.paginationConfig.page ,
            orderByExpression: this.$scope.orderByExpression,
            whereCondition: JSON.stringify(this.$scope.filter)
        },
            this.$scope.$stateParams,
            this.config,
            this.$scope.filter)).$promise.then((data) => {
         
            this.$scope.items = data;
            this.$scope.pager.page = this.$scope.paginationConfig.page;
            this.$scope.waiting--;
            if ((<any>data).otherInfo) {
                this.$scope.reportSummary = (<any>data).otherInfo;
            }
        }, (data) => {
            this.$scope.waiting--;
        });
    }
     
    deleteObject(item: IRootObject) {
        
        if(confirm("Are sure you want to delete the item?")){
            this.$scope.waiting++;
            this.Resource.delete(item).$promise.then(() => {
                this.$scope.waiting--;
                alert("Item was successfully deleted");
                this.setupPagination();
            }, (response) => {
                alert(response.data.message);
                this.$scope.waiting--;
            });
        }
    }
   
    reloadPage() {
        this.$scope.$state.reload();
    }

    orderExpressionChanged() {
        if (this.$scope.order.column && this.$scope.order.direction) {
            this.$scope.orderByExpression =  this.$scope.order.column + " " + this.$scope.order.direction;
            
            this.pageChanged();
         
        } else
            this.$scope.orderByExpression = null;
    }
    goBack(forward?: boolean, data?) {

        this.$scope.$state.go(this.$scope.backLink.forwardLink || this.$scope.backLink.state, $.extend({},
            this.$scope.$stateParams, this.config, this.$scope.item));
    }
} 