Database.Store.Request = class extends Database.Transaction.Request {

    constructor(store, mode, method, args) {
        super(mode, method, args);
        this.store = store;
    }

    get storeName() {
        return this.store.name;
    }

    executeOn(idbTransaction) {
        const idbStore = idbTransaction.objectStore(this.store.name);
        super.executeOn(idbStore);
    }

    static addTo(store, value, key) {
        return new Database.Store.Request(store, Database.Transaction.READ_WRITE, IDBObjectStore.prototype.add, [value, key]);
    }

    static countIn(store, query) {
        return new Database.Store.Request(store, Database.Transaction.READ_ONLY, IDBObjectStore.prototype.count, [query]);
    }

    static clearFrom(store) {
        return new Database.Store.Request(store, Database.Transaction.READ_WRITE, IDBObjectStore.prototype.clear, []);
    }

    static deleteFrom(store, key) {
        return new Database.Store.Request(store, Database.Transaction.READ_WRITE, IDBObjectStore.prototype.delete, [key]);
    }

    static getFrom(store, key) {
        return new Database.Store.Request(store, Database.Transaction.READ_ONLY, IDBObjectStore.prototype.get, [key]);
    }

    static getKeyFrom(store, key) {
        return new Database.Store.Request(store, Database.Transaction.READ_ONLY, IDBObjectStore.prototype.getKey, [key]);
    }

    static getAllFrom(store, query, count) {
        return new Database.Store.Request(store, Database.Transaction.READ_ONLY, IDBObjectStore.prototype.getAll, [query, count]);
    }

    static getAllKeysFrom(store, query, count) {
        return new Database.Store.Request(store, Database.Transaction.READ_ONLY, IDBObjectStore.prototype.getAllKeys, [query, count]);
    }

    static putIn(store, value, key) {
        return new Database.Store.Request(store, Database.Transaction.READ_WRITE, IDBObjectStore.prototype.put, [value, key]);
    }

}
