var schoolId;
var FileUploadSvc = (function () {
    function FileUploadSvc($parse, Upload) {
        this.$parse = $parse;
        this.Upload = Upload;
    }
    FileUploadSvc.prototype.uploadSingleFile = function (file, uploadItem, model) {
        var modelSetter = this.$parse(model).assign;
        uploadItem.fileProgress = 0;
        if (!file) {
            modelSetter(uploadItem, "");
            return;
        }
        var url = angular.isArray(file) ? '/api/fileupload/multiple' : '/api/fileupload/single';
        this.Upload.upload({
            url: url,
            data: { file: file }
        }).then(function (resp) {
            modelSetter(uploadItem, (angular.isArray(file) ? resp.data.filename.join(',') : resp.data.filename));
            uploadItem.fileProgress = 0;
            return resp.data.filename;
        }, function (resp) {
            console.log('Error status: ' + resp.status);
            uploadItem.fileProgress = 0;
        }, function (evt) {
            var progressPercentage = 100.0 * evt.loaded / evt.total;
            uploadItem.fileProgress = progressPercentage;
        });
    };
    FileUploadSvc.$inject = ["$parse", "Upload"];
    return FileUploadSvc;
}());
angular.module("app").service("FileUploadSvc", FileUploadSvc);
//# sourceMappingURL=FileUploadSvc.js.map