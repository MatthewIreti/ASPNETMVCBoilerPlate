
class BaseEditCtrl extends BaseCreateEditCtrl {
    
    constructor($scope: ICreateEditCtrlScope, 
        Resource: IRootResource<IRootObject>,
         config?: any) {
        super($scope, Resource, null, config);
        $scope.editMode = true;
    }
}