Database.Store.Index = class {

    constructor(store, name, keyPath, options) {
        Object.defineProperties(this, {
            name: {
                configurable: false,
                writable: false,
                value: name
            },
            store: {
                configurable: false,
                writable: false,
                value: store
            },
            keyPath: {
                configurable: false,
                writable: false,
                value: keyPath
            },
            options: {
                configurable: false,
                writable: false,
                enumerable: false,
                value: Object.freeze(options)
            }
        });
    }

    get isAutoLocale() {
        return this.options.locale === 'auto';
    }

    get locale() {
        return this.options.locale;
    }

    get multiEntry() {
        return !!this.options.multiEntry;
    }

    get unique() {
        return !!this.options.unique;
    }

    count(query) {
        const request = Database.Store.Index.Request.countIn(this, query);
        return this.store.database.handleRequest(request);
    }

    get(key) {
        const request = Database.Store.Index.Request.getFrom(this, key);
        return this.store.database.handleRequest(request);
    }

    getKey(key) {
        const request = Database.Store.Index.Request.getKeyFrom(this, key);
        return this.store.database.handleRequest(request);
    }

    getAll(query, count) {
        const request = Database.Store.Index.Request.getAllFrom(this, query, count);
        return this.store.database.handleRequest(request);
    }

    getAllKeys(query, count) {
        const request = Database.Store.Index.Request.getAllKeysFrom(this, query, count);
        return this.store.database.handleRequest(request);
    }

    getCursor(isReadOnly, query, direction) {
        const cursor = new Database.Cursor(this);
        const opener = Database.Store.Index.CursorOpener.withValue(cursor, isReadOnly, query, direction);
        this.store.database.handleRequest(opener);
        return cursor;
    }

    getKeyCursor(isReadOnly, query, direction) {
        const cursor = new Database.Cursor(this);
        const opener = Database.Store.Index.CursorOpener.withoutValue(cursor, isReadOnly, query, direction);
        this.store.database.handleRequest(opener);
        return cursor;
    }

}
