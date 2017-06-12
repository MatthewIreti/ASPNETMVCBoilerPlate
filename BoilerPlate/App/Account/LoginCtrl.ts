/// <reference path="../models.ts" />
 
    interface ILoginCtrlScope extends IRootScope {
        validationRule:IValidationRule;
        userInfo;
        waiting;
        submitForm;
        errors:string[];
        showToast;
    }


    class LoginCtrl {
        static $inject: string[] = ["$scope", 'UserProfileResource',"AccountSvc"];

        constructor(private $scope: ILoginCtrlScope,
            private UserProfileResource: IUserProfileResource,
            private AccountSvc: IAccountSvc) {
             
                $scope.userInfo = {};
                $scope.waiting = 0;
                $scope.errors = [];
                $scope.validationRule = {
                    rules: {
                        username: {
                            required: true
                        },
                        password: {
                            required: true
                        }
                    },
                    messages: {

                    }
                };
                $scope.submitForm = () => this.submitForm(); 
        }
         
        submitForm() {
            this.$scope.waiting++;
            this.AccountSvc.login(this.$scope.userInfo, (data) => {
               
                $.cookie("token", data.access_token, { path: '/' }); 
                this.UserProfileResource.getCurrentUserInfo().$promise.then((resp) => {
                    if ((<any>resp).emailAddress==="" || (<any>resp).emailAddress===null) {
                        this.$scope.$state.go("account.updateemailaddress",resp);
                    } else if (!(<any>resp).passwordChanged) {
                        this.$scope.$state.go("account.changepassword");
                    } else {
                        location.pathname = "/";
                    }

                });
                 
            }, (response)=> {
                this.$scope.$apply(()=> {
                    this.$scope.waiting--;
                    this.$scope.errors = this.$scope.errorHandle.handleError(response);
                });
            });
        }

    }

    angular.module("app").controller("LoginCtrl", LoginCtrl);;