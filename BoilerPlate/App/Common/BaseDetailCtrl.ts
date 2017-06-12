
interface IBaseDetailCtrlScope extends IRootScope {
    item;
    toggleActive;
    waiting;
    deleteObject; 
    submitForm;
    validationRule; 
    title;
    wizard;  
    goBack();
    backLink: IBackLink;  
    errors: any[];
    handleError: (response: any) => void;
    closeModal;
}

interface IBaseDetailCtrl {

}

class BaseDetailCtrl  {

    constructor(public $scope: IBaseDetailCtrlScope,
        public Resource: IRootResource<IRootObject>, private backLink,
        public config?,public $modalInstance?: any) {
        $scope.breadcrumbs.splice(0, $scope.breadcrumbs.length);
        this.init();
        this.$scope.goBack = () => this.goBack();
        this.$scope.backLink = {};
        this.$scope.closeModal = () => {
            $modalInstance.close();
        };
    }
     $promise;
    reload() {
        this.$scope.waiting = 1;
        
        this. $promise = null;
        if (this.Resource.details)
            this.$promise = this.Resource.details(this.$scope.$stateParams).$promise;
        else
            this.$promise = this.Resource.get(this.$scope.$stateParams).$promise;
        this.$promise
           .then((data) => {
               this.$scope.item = data;
            this.$scope.waiting--; 
        });
    }
     
    init() {
        this.$scope.$stateParams = $.extend(this.$scope.$stateParams, this.config);
        this.$scope.toggleActive = () => this.toggleActive();
        this.$scope.deleteObject = () => this.deleteObject(); this.reload(); 
        this.$scope.submitForm = () => this.submitForm();
        this.$scope.validationRule = {
            rules: {
                
            },
            messages: {

            }
        };
        this.$scope.handleError = (response) => this.handleError(response);
    }
    deleteObject() {
        if (window.confirm("Continue delete?")) {
            this.$scope.waiting++;
            this.Resource.delete(this.$scope.item).$promise.then(() => {
                this.$scope.waiting--;
                alert("Deleted successfully!");
                this.$scope.$state.go(this.backLink.forwardLink, this.$scope.$stateParams);
            }, (response) => {
                this.$scope.waiting--;
            });
        }
    }
    submitForm() {
        this.$scope.waiting++;
        var promise: ng.IPromise<Object>;
    }
     
    goBack(forward?: boolean, data?) {
        this.$scope.$state.go(this.$scope.backLink.forwardLink || this.$scope.backLink.state, $.extend({},
            this.$scope.$stateParams, this.config, this.$scope.item));
    }
    toggleActive() {
        this.$scope.waiting++;
        this.Resource.toggleActive(this.$scope.item).$promise.
            then((data) => {
            this.$scope.item = data;
            this.$scope.waiting--;
            alert("Action successful");
        },(response)=> {
            this.$scope.waiting--;
            alert("Error occured");
        });
    }
    handleError(response) { 
        this.$scope.errors = [];
        this.$scope.errors = this.$scope.errorHandle.handleError(response);
        this.$scope.waiting = 0;
    }
}

angular.module("app").controller("BaseDetailCtrl", BaseDetailCtrl);
 