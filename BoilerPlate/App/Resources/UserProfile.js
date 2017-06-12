UserProfileResource.$inject = ["$resource"];
function UserProfileResource($resource) {
    var count = {
        method: "GET",
        isArray: false,
        url: "/api/UserProfile/count"
    };
    var nameAndValues = {
        method: "GET",
        isArray: true,
        url: "/api/UserProfile/NameAndValues"
    };
    var updateAction = {
        method: 'PUT',
        isArray: false
    };
    var getCurrentUserInfo = {
        method: "GET",
        isArray: false,
        url: "/api/UserProfile/GetCurrentUserInfo"
    };
    var details = {
        method: "GET",
        isArray: false,
        url: "/api/UserProfile/Details"
    };
    var getUserProfiles = {
        method: "post",
        isArray: false,
        url: "/api/UserProfile/getUserProfiles"
    };
    var updateUserIdentity = {
        method: "Put",
        isArray: true,
        url: "/api/UserProfile/updateUserIdentity"
    };
    var toggleActive = {
        method: 'POST',
        isArray: false,
        url: "/api/UserProfile/ToggleActive/:id"
    };
    var getRolesNameAndId = {
        method: 'Get',
        isArray: true,
        url: "/api/UserProfile/getRolesNameAndId"
    };
    var service = $resource('/api/UserProfile/:id', { id: '@id' }, {
        count: count,
        update: updateAction,
        nameAndValues: nameAndValues,
        getCurrentUserInfo: getCurrentUserInfo,
        details: details,
        getUserProfiles: getUserProfiles,
        updateUserIdentity: updateUserIdentity,
        toggleActive: toggleActive,
        getRolesNameAndId: getRolesNameAndId
    });
    return service;
}
angular.module("app").factory("UserProfileResource", UserProfileResource);
//# sourceMappingURL=UserProfile.js.map