

    interface IAccountSvc {
        login(userInfo, successCallBack: Function, failureCallBack: Function);
    }
    
    class AccountSvc implements IAccountSvc {
        static $inject: string[] = ["$http"];

        constructor(private $http: ng.IHttpService) {
        }

        login(userInfo, successCallBack: Function, failureCallBack: Function) {
            userInfo.grant_type = "password";
           $.ajax({
               url: '/token',
               type: "POST",
               data: userInfo,
               beforeSend: (xhr) =>{
                   xhr.setRequestHeader("Authorization", "Bearer " + $.cookie("token"));
               }
           }).done((data) => {
               successCallBack(data);
           }).fail((response) => {
               failureCallBack(response);
           });
       }
    }

    angular.module("app").service("AccountSvc", AccountSvc);
