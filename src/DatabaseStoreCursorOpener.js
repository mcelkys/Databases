Database.Store.CursorOpener = class extends Database.Cursor.Opener {

    get storeName() {
        return this.cursor.source.name;
    }

    executeOn(idbTransaction) {
        const idbStore = idbTransaction.objectStore(this.cursor.source.name);
        super.executeOn(idbStore);
    }

    static withValue(cursor, isReadOnly, query, direction) {
        const mode = isReadOnly ? Database.Transaction.READ_ONLY : Database.Transaction.READ_WRITE;
        return new Database.Store.CursorOpener(cursor, mode, IDBObjectStore.prototype.openCursor, [query, direction]);
    }

    static withoutValue(cursor, isReadOnly, query, direction) {
        const mode = isReadOnly ? Database.Transaction.READ_ONLY : Database.Transaction.READ_WRITE;
        return new Database.Store.CursorOpener(cursor, mode, IDBObjectStore.prototype.openKeyCursor, [query, direction]);
    }

}
