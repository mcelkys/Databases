Database.Store = class {

    constructor(database, name, options) {
        Object.defineProperties(this, {
            name: {
                configurable: false,
                writable: false,
                value: name
            },
            options: {
                configurable: false,
                writable: false,
                enumerable: false,
                value: Object.freeze(options || {})
            },
            indices: {
                configurable: false,
                writable: false,
                enumerable: false,
                value: new Map
            },
            database: {
                configurable: false,
                writable: false,
                value: database
            },
        });
    }

    get indexNames() {
        return Array.from(this.indices.keys());
    }

    get keyPath() {
        return this.options.keyPath;
    }

    get autoIncrement() {
        return this.options.autoIncrement;
    }

    add(value, key) {
        const request = Database.Store.Request.addTo(this, value, key);
        return this.database.handleRequest(request);
    }

    count(query) {
        const request = Database.Store.Request.countIn(this, query);
        return this.database.handleRequest(request);
    }

    clear() {
        const request = Database.Store.Request.clearFrom(this);
        return this.database.handleRequest(request);
    }

    delete(key) {
        const request = Database.Store.Request.deleteFrom(this, key);
        return this.database.handleRequest(request);
    }

    get(key) {
        const request = Database.Store.Request.getFrom(this, key);
        return this.database.handleRequest(request);
    }

    getKey(key) {
        const request = Database.Store.Request.getKeyFrom(this, key);
        return this.database.handleRequest(request);
    }

    getAll(query, count) {
        const request = Database.Store.Request.getAllFrom(this, query, count);
        return this.database.handleRequest(request);
    }

    getAllKeys(query, count) {
        const request = Database.Store.Request.getAllKeysFrom(this, query, count);
        return this.database.handleRequest(request);
    }

    getIndex(name) {
        return this.indices.get(name);
    }

    getCursor(isReadOnly, query, direction) {
        const cursor = new Database.Cursor(this);
        const opener = Database.Store.CursorOpener.withValue(cursor, isReadOnly, query, direction);
        this.database.handleRequest(opener);
        return cursor;
    }

    getKeyCursor(isReadOnly, query, direction) {
        const cursor = new Database.Cursor(this);
        const opener = Database.Store.CursorOpener.withoutValue(cursor, isReadOnly, query, direction);
        this.database.handleRequest(opener);
        return cursor;
    }

    put(value, key) {
        const request = Database.Store.Request.putIn(this, value, key);
        return this.database.handleRequest(request);
    }

}
