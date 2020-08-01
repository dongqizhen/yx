export default function(img) {
    function getBase64Image(img, width, height) { //width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
        var canvas = document.createElement("canvas");
        canvas.width = width ? width : img.width;
        canvas.height = height ? height : img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        var dataURL = canvas.toDataURL();
        return dataURL;
    }
    var image = new Image();
    image.crossOrigin = '';
    image.src = img;
    //var deferred = $.Deferred();
    var deferred = new Deferred();
    if (img) {
        image.onload = function() {
            deferred.resolve(getBase64Image(image)); //将base64传给done上传处理
        }

        //问题要让onload完成后再return sessionStorage['imgTest']
    } else {}
    return deferred.promise;
}

function Deferred() {
    var self = this;
    self.promise = new Promise(function(resolve, reject) {
        self._resolve = resolve;
        self._reject = reject;
    });
}

Deferred.prototype.resolve = function(data) {
    this._resolve(data);
}

Deferred.prototype.reject = function(data) {
    //this._reject.call(this.promise,data);
    this._reject(data);
}