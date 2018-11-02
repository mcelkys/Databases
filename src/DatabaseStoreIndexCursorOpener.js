Database.Store.Index.CursorOpener = class extends Database.Cursor.Opener {

    get storeName() {
        return this.cursor.source.store.name;
    }

    executeOn(idbTransaction) {
        const idbStore = idbTransaction.objectStore(this.cursor.source.store.name);
        const idbIndex = idbStore.index(this.cursor.source.name);
        super.executeOn(idbIndex);
    }

    static withValue(cursor, isReadOnly, query, direction) {
        const mode = isReadOnly ? Database.Transaction.READ_ONLY : Database.Transaction.READ_WRITE;
        return new Database.Store.Index.CursorOpener(cursor, mode, IDBIndex.prototype.openCursor, [query, direction]);
    }

    static withoutValue(cursor, isReadOnly, query, direction) {
        const mode = isReadOnly ? Database.Transaction.READ_ONLY : Database.Transaction.READ_WRITE;
        return new Database.Store.Index.CursorOpener(cursor, mode, IDBIndex.prototype.openKeyCursor, [query, direction]);
    }

}
