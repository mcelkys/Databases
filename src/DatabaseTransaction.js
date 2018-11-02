Database.Transaction = class {

    constructor() {
        this.storeNames = new Set;
        this.requests = [];
        this.mode = Database.Transaction.READ_ONLY;
        this.hasBegun = false;
    }

    addRequest(request) {
        this.mode = request.mode > this.mode ? request.mode : this.mode;
        this.storeNames.add(request.storeName);
        this.requests.push(request);
        return request.toPromise();
    }

    getUnattemptedRequests() {
        return this.requests.filter(r => !r.hasExecuted);
    }

    performOn(database) {
        return new Promise((resolve, reject) => {
            database.getConnection().then(idb => {
                const idbTransaction = idb.transaction(Array.from(this.storeNames), Database.Transaction.MODES.get(this.mode));
                this.hasBegun = true;
                idbTransaction.oncomplete = resolve;
                idbTransaction.onerror = event => {
                    reject(idbTransaction.error);
                };
                idbTransaction.onabort = event => {
                    reject(idbTransaction.error);
                };
                for (let request of this.requests) {
                    request.executeOn(idbTransaction);
                }
            }).catch(reject);
        });
    }

    rejectAttemptedRequests(error) {
        for (let request of this.requests.filter(r => r.hasExecuted)) {
            request.reject(error);
        }
    }

}

Database.Transaction.READ_ONLY = 0;
Database.Transaction.READ_WRITE = 1;
Database.Transaction.VERSION_CHANGE = 2;
Database.Transaction.MODES = new Map([
    [0, 'readonly'],
    [1, 'readwrite'],
    [2, 'versionchange']
]);
