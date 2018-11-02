class Database {

    constructor(name, version) {
        Object.defineProperties(this, {
            name: {
                writable: false,
                configurable: false,
                value: name
            },
            version: {
                writable: false,
                configurable: false,
                value: version
            },
            stores: {
                configurable: false,
                writable: false,
                enumerable: false,
                value: new Map
            },
            transactions: {
                configurable: false,
                writable: false,
                enumerable: false,
                value: []
            }
        });
    }

    get storeNames() {
        return Array.from(this.stores.keys());
    }

    handleRequest(request) {
        var transaction = this.transactions.find(t => !t.hasBegun);
        if (!transaction) {
            transaction = this.createTransaction();
            setTimeout(() => {
                transaction.performOn(this).then(() => {
                    transaction.getUnattemptedRequests().forEach(this.handleRequest.bind(this));
                    this.removeTransaction(transaction);
                }).catch(error => {
                    transaction.getUnattemptedRequests().forEach(this.handleRequest.bind(this));
                    transaction.rejectAttemptedRequests(error);
                    this.removeTransaction(transaction);
                });
            }, 0);
        }
        return transaction.addRequest(request);
    }

    createTransaction() {
        const transaction = new Database.Transaction();
        this.transactions.push(transaction);
        return transaction;
    }

    removeTransaction(transaction) {
        const index = this.transactions.indexOf(transaction);
        if (index > -1) this.transactions.splice(index, 1);
    }

    getConnection() {
        if (this.connection) return Promise.resolve(this.connection);
        else {
            return new Promise((resolve, reject) => {
                const connectionRequest = indexedDB.open(this.name, this.version);
                connectionRequest.onerror = event => {
                    reject(connectionRequest.error);
                };
                connectionRequest.onsuccess = event => {
                    this.connection = connectionRequest.result;
                    resolve(this.connection);
                };
                connectionRequest.onupgradeneeded = event => {
                    const idb = connectionRequest.result;
                    const idbTransaction = connectionRequest.transaction;
                    const existingStoreNames = Array.from(idb.objectStoreNames);
                    for (let store of this.stores.values()) {
                        let idbStore = existingStoreNames.includes(store.name)
                            ? idbTransaction.objectStore(store.name)
                            : idb.createObjectStore(store.name, store.options);
                        let existingIndices = Array.from(idbStore.indexNames);
                        for (let index of store.indices.values()) {
                            if (!existingIndices.includes(index.name))
                                idbStore.createIndex(index.name, index.keyPath, index.options);
                        }
                        for (let index of existingIndices) {
                            if (!store.indices.has(index))
                                idbStore.deleteIndex(index);
                        }
                    }
                    for (let storeName of existingStoreNames) {
                        if (!this.stores.has(storeName))
                            idb.deleteObjectStore(storeName);
                    }
                };
            });
        }
    }

    getStore(name) {
        return this.stores.get(name);
    }

    close() {
        if (this.connection) {
            this.connection.close();
            delete this.connection;
        }
    }

    delete() {
        this.close();
        return new Promise((resolve, reject) => {
            const request = indexedDB.deleteDatabase(this.name);
            request.onsuccess = event => {
                Database.DATABASES.delete(this.name);
                if (this === Database.DEFAULT_DATABASE)
                    delete Database.DEFAULT_DATABASE;
                resolve(event.result);
            };
            request.onerror = event => {
                reject(request.error);
            };
        });
    }

    static define({ name, version, isDefault, stores }) {
        const db = new this(name, version);
        if (stores) {
            for (let storeName in stores) {
                let storeConf = stores[storeName] || {};
                let store = new Database.Store(db, storeName, storeConf.options);
                if (storeConf.indices) {
                    for (let indexName in storeConf.indices) {
                        let indexConf = storeConf.indices[indexName];
                        let index = new Database.Store.Index(store, indexName, indexConf.keyPath, indexConf.options);
                        store.indices.set(index.name, index);
                    }
                }
                db.stores.set(store.name, store);
            }
        }
        this.DATABASES.set(db.name, db);
        if (isDefault) this.DEFAULT_DATABASE = db;
        return db;
    }

    static get(name) {
        return name ? this.DATABASES.get(name) : this.DEFAULT_DATABASE;
    }

}

Database.DATABASES = new Map;
