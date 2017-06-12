app.factory('errorHandle', () => {
     
    return {
      
            handleError: (response)=> {
                var errors = [];
                var modelState: {};
                if (response.responseJSON) {
                    errors.push(response.responseJSON.error_description);
                } else if (response.data ) {
                    if (response.data.modelState) {
                        modelState = response.data.modelState;
                        for (var key in modelState) {
                            errors = errors.concat(modelState[key]);
                        }
                    } else if (response.data.message) {
                        errors.push(response.data.message);
                    }
                }
                return errors;
            }
        };
    }
);

 