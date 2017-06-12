
class BaseCreateCtrl extends BaseCreateEditCtrl{
    constructor($scope: ICreateEditCtrlScope, 
        Item: ng.resource.IResourceClass<IRootObject>,
        config?: any);
    constructor($scope: any, 
         Item: ng.resource.IResourceClass<IRootObject>,
        config?: any) {
        super( $scope,  null, Item, config);
    }
} 