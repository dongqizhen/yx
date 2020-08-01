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


export default Deferred