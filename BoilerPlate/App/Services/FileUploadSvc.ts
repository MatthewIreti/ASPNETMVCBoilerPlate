

interface IFileUploadSvc {
    uploadSingleFile: (file, uploadItem, model) => void; 
}

var schoolId;

class FileUploadSvc implements IFileUploadSvc {
    static $inject: string[] = ["$parse", "Upload"];

    constructor(private $parse: ng.IParseService, private Upload ) {

    }

    uploadSingleFile(file, uploadItem, model) {

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
        }).then(resp => {
            modelSetter(uploadItem, (angular.isArray(file) ? resp.data.filename.join(',') : resp.data.filename));
            uploadItem.fileProgress = 0;
            return resp.data.filename;
        }, (resp) => {
            console.log('Error status: ' + resp.status);
            uploadItem.fileProgress = 0;
        }, (evt) => {
            var progressPercentage = 100.0 * evt.loaded / evt.total;
            uploadItem.fileProgress = progressPercentage;
        });
    }
    
}

angular.module("app").service("FileUploadSvc", FileUploadSvc);
