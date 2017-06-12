var app;
app.config(['stateHelperProvider', '$urlRouterProvider', (stateHelperProvider: ng.ui.IStateProvider, $urlRouterProvider) => {
   
    $urlRouterProvider.otherwise('/account/login');
    var accountPath = '/App/Account';
    stateHelperProvider
        .state({
        name: 'account',
        url: '/account',
        controller: [
            '$scope',($scope) => {
                $scope.$state.go("account.login");
            }
        ],
        abstract: true,
        templateUrl: accountPath + '/account.html',
        children: [
            {
                name: 'login',
                url: '/login',
                templateUrl: accountPath + '/login.html',
                controller: "LoginCtrl"
            },
            {
                name: 'registerapplicant',
                url: '/registerapplicant',
                templateUrl: accountPath + '/registerApplicant.html',
                controller: "RegisterApplicantCtrl"
            },
            {
                name: 'registrationsuccessful',
                url: '/registrationsuccessful',
                params: {
                    obj: null
                },
                templateUrl: accountPath + '/registrationsuccessful.html',
                controller: "RegistrationSuccessfulCtrl"
            },
            {
                name: 'confirmemail',
                url: '/confirmemail?userId?code',
                templateUrl: accountPath + '/manage/emailconfirmed.html',
                controller: "EmailConfirmedCtrl"
            },{
                name: 'changepassword',
                url: '/changepassword',
                
                templateUrl: accountPath + '/manage/changepassword.html',
                controller: "ChangePasswordCtrl"
            },{
                name: 'forgotpassword',
                url: '/forgotpassword',
                
                templateUrl: accountPath + '/manage/forgotpassword.html',
                controller: "ForgotPasswordCtrl"
            }
            , {
                name: 'resetpassword',
                url: '/resetpassword?code?email',
                
                templateUrl: accountPath + '/manage/resetpassword.html',
                controller: "ResetPasswordCtrl"
            }
            , {
                name: 'updateemailaddress',
                url: '/updateemailaddress/:id',
                templateUrl: accountPath + '/manage/updateemailaddress.html',
                controller: "UpdateEmailCtrl"
            }
        ]
    });
}]);
