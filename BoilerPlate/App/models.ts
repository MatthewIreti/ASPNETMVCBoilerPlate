 
interface IRootObject extends ng.resource.IResource<IRootObject> {
    id: number;
    $update(config?): IRootObject;
    selected: boolean;
    $count(config?): INameAndValue[];

}
interface IRootResource<T extends IRootObject> extends ng.resource.IResourceClass<T> {
    update(config?): IRootObject;
    count: any;
    deleteAll: any;
    toggleActive(config?): any;
    details(params): any; 
}
interface INameAndValue {
    name: string;
    value: number;
}
interface IUserProfile extends IRootObject {

}

interface IBackLink {
    state?: string;
    config?: {};
    forwardLink?: string;
};
interface IRootScope extends ng.IScope {
    $state: ng.ui.IStateService;
    $stateParams; 
    currentUserInfo: IUserProfile;
    breadcrumbs: IBreadcrumb[];
    goToState: (index: number) => void;
    statusList: { value: boolean; name: string }[];
    yesNoList: { value: boolean; name: string }[];
    errorHandle;
    notification;
    getLabelLabel;
    getLabelColor;
    submit;  
    roundUpFigure;
    getMonthText; 
    regType;
    idenType; 
    openDate: ($event: any, property: any) => void;
    opened: {};
}

interface ICreateEditService {
    validationRule: IValidationRule;
    backLink: any; 
}
interface IBreadcrumb {
    link?: string;
    title: string;
    config?: {}
}

