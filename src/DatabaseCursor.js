Database.Cursor = class {

    constructor(source) {
        this.source = source;
        this.itterations = [[]];
        this.hasExecuted = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    get invocations() {
        return this.itterations[this.itterations.length - 1];
    }

    get itteration() {
        return this.itterations[0];
    }

    advance(count) {
        this.invocations.push(idbCursor => {
            idbCursor.advance(count);
        });
        this.itterations.push([]);
    }

    continue(key) {
        this.invocations.push(idbCursor => {
            idbCursor.continue(key);
        });
        this.itterations.push([]);
    }

    continuePrimaryKey(key, primaryKey) {
        this.invocations.push(idbCursor => {
            idbCursor.continuePrimaryKey(key, primaryKey);
        });
        this.itterations.push([]);
    }

    executeOn(idbRequest) {
        idbRequest.onsuccess = event => {
            const idbCursor = idbRequest.result;
            if (idbCursor instanceof IDBCursor)
                this.performIterationOn(idbCursor);
            else this.resolve();
        };
        idbRequest.onerror = event => {
            this.reject(idbRequest.error);
        };
    }

    performIterationOn(idbCursor) {
        if (this.itteration.length === 0 && typeof this.callback === 'function') {
            if (idbCursor instanceof IDBCursorWithValue)
                this.callback(idbCursor.value, idbCursor.key, idbCursor.primaryKey);
            else this.callback(idbCursor.key, idbCursor.primaryKey);
        }
        if (this.itteration.length === 0) this.resolve();
        else for (let fn of this.itterations.shift()) {
            fn(idbCursor);
        }
    }

    seek(callback) {
        this.callback = callback;
        return this.hasExecuted;
    }

    delete() {
        return new Promise((resolve, reject) => {
            this.invocations.push(idbCursor => {
                const idbRequest = idbCursor.delete();
                idbRequest.onsuccess = event => {
                    resolve(idbRequest.result);
                };
                idbRequest.onerror = event => {
                    reject(idbRequest.error);
                };
            });
        });
    }

    update(value) {
        return new Promise((resolve, reject) => {
            this.invocations.push(idbCursor => {
                const idbRequest = idbCursor.update(value);
                idbRequest.onsuccess = event => {
                    resolve(idbRequest.result);
                };
                idbRequest.onerror = event => {
                    reject(idbRequest.error);
                };
            });
        });
    }

}
