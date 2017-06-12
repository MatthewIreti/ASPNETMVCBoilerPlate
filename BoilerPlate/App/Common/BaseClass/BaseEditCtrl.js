var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseEditCtrl = (function (_super) {
    __extends(BaseEditCtrl, _super);
    function BaseEditCtrl($scope, Resource, config) {
        _super.call(this, $scope, Resource, null, config);
        $scope.editMode = true;
    }
    return BaseEditCtrl;
}(BaseCreateEditCtrl));
//# sourceMappingURL=BaseEditCtrl.js.map