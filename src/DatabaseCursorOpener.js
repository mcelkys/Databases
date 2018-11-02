Database.Cursor.Opener = class extends Database.Transaction.Request {

    constructor(cursor, mode, method, args) {
        super(mode, method, args);
        this.cursor = cursor;
    }

    executeOn(idbSource) {
        this.hasExecuted = true;
        const args = this.args.filter(arg => arg !== undefined);
        const idbRequest = this.method.apply(idbSource, args);
        this.cursor.executeOn(idbRequest);
    }

}
