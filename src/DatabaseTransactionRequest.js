Database.Transaction.Request = class {

    constructor(mode, method, args) {
        this.mode = mode;
        this.method = method;
        this.args = args;
        this.hasExecuted = false;
    }

    get storeName() {
        throw new Error('Database.Transaction.Request is an abstract class. Extending classes must override the storeName getter.');
    }

    executeOn(idbSource) {
        this.hasExecuted = true;
        const args = this.args.filter(arg => arg !== undefined);
        const idbRequest = this.method.apply(idbSource, args);
        idbRequest.onsuccess = event => {
            this.resolve(idbRequest.result);
        };
        idbRequest.onerror = event => {
            this.reject(idbRequest.error);
        };
    }

    toPromise() {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

}
