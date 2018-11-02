Database.Store.Index.Request = class extends Database.Transaction.Request {

    constructor(index, method, args) {
        super(Database.Transaction.READ_ONLY, method, args);
        this.index = index;
    }

    get storeName() {
        return this.index.store.name;
    }

    executeOn(idbTransaction) {
        const idbStore = idbTransaction.objectStore(this.index.store.name);
        const idbIndex = idbStore.index(this.index.name);
        super.executeOn(idbIndex);
    }

    static countIn(index, query) {
        return new Database.Store.Index.Request(index, IDBIndex.prototype.count, [query]);
    }

    static getFrom(index, key) {
        return new Database.Store.Index.Request(index, IDBIndex.prototype.get, [key]);
    }

    static getKeyFrom(index, key) {
        return new Database.Store.Index.Request(index, IDBIndex.prototype.getKey, [key]);
    }

    static getAllFrom(index, query, count) {
        return new Database.Store.Index.Request(index, IDBIndex.prototype.getAll, [query, count]);
    }

    static getAllKeysFrom(index, query, count) {
        return new Database.Store.Index.Request(index, IDBIndex.prototype.getAllKeys, [query, count]);
    }

}
