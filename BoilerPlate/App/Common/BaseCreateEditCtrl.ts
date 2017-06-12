interface ICreateEditCtrlScope extends IRootScope {
    title: string;
    reloadForm();
    goBack();
    submitForm(data?: any);
    errors: string[];
    item: IRootObject;
    waiting: number;
    validationRule: IValidationRule;
    modelState;
    backLink: IBackLink
    openDate;
    opened;
    processFile;
    formId;
    editMode;
    createMode;
    stepUpWait;
    stepDownWait
}

class BaseCreateEditCtrl {
    
    config: any;

    constructor(public $scope: ICreateEditCtrlScope, 
        public Resource: IRootResource<IRootObject>,
        public Item: ng.resource.IResourceClass<IRootObject>,
        config?: any) {
        $scope.breadcrumbs.splice(0, $scope.breadcrumbs.length);
        this.config = $.extend($scope.$stateParams, config);
         $scope.backLink = {}
        this.$scope.openDate = ($event, property: string) => {
            $event.preventDefault();
            $event.stopPropagation();
            this.$scope.opened[property] = true;
        };
        this.$scope.processFile = false;
        this.$scope.formId = "";
        this.$scope.opened = {};
        $scope.goBack = () => this.goBack();
        $scope.submitForm = () => this.submitForm();
        $scope.reloadForm = () => this.reloadForm();
        $scope.item = <IRootObject>{};
        $scope.waiting = 1;
        if (this instanceof BaseEditCtrl) {
            this.$scope.item = Resource.get(this.config);
            this.$scope.item.$promise.then((data) => {
               // this.$scope.item = data;
                this.$scope.waiting --;
            });
        } else {
            
            $scope.item = new Item(this.config);
            $scope.waiting--;
        }
        $scope.stepUpWait = () => this.stepUpWait();
        $scope.stepDownWait = ()=> this.stepDownWait();
    }
    stepUpWait() {
        this.$scope.waiting++;
    }
    stepDownWait() {
        this.$scope.waiting--;
    }
    submitForm() {
        this.$scope.waiting++;
        if (this instanceof BaseEditCtrl) {
            this.Resource.update(this.$scope.item).$promise.then((data) => {
                alert("Updated successfully");
                this.goBack(true, data);

            }, (response) => {
                alert("There was an error updating the information");
                this.handleError(response);
            });
        } else {
            this.$scope.item.$save((data) => {
                alert("Saved successfully");
                this.goBack(true, data);
            }, (response) => {
                alert("There was an error saving the information");
                this.handleError(response);
            });
        }
    }
    
   handleError(response) { 
       this.$scope.errors = [];
       this.$scope.errors = this.$scope.errorHandle.handleError(response);
       this.$scope.waiting = 0;
   }
    reloadForm() {
        this.$scope.errors = [];
        this.$scope.waiting ++;
        if (this instanceof BaseEditCtrl) {
            
            this.$scope.item = this.Resource.get(this.config);
            this.$scope.item.$promise.then(() => {
                this.$scope.waiting --;
            });
        } else {
            this.$scope.item = new this.Item(this.config);
            this.$scope.waiting--;
        }
    }
    goBack(forward?: boolean, data?) {
        this.$scope.$state.go(forward ? this.$scope.backLink.forwardLink : this.$scope.backLink.state,
            $.extend({}, this.$scope.$stateParams, this.config, data));
    }
} 