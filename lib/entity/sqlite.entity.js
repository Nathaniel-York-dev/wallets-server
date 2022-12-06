const sqlite3 = require('sqlite3').verbose();

class SqliteEntity {
    constructor({path}) {
        this.path = path;
        this.db = new sqlite3.Database(path);
    }

    async query(query) {
        return new Promise((resolve, reject) => {
            this.db.run(query, (
                err => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                }
            ));
        });
    }

    async createUsersTable() {
        return this.query('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT)');
    }

    async createCardsTable() {
        return this.query('CREATE TABLE IF NOT EXISTS cards (id INTEGER PRIMARY KEY AUTOINCREMENT, number TEXT, cvv TEXT, name TEXT, exp_date TEXT, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))');
    }

    async createTransactionsTable() {
        return this.query('CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, amount INTEGER, description TEXT, user_id INTEGER, card_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(card_id) REFERENCES cards(id))');
    }

    async createBalanceTable() {
        return this.query('CREATE TABLE IF NOT EXISTS balance (id INTEGER PRIMARY KEY AUTOINCREMENT, amount INTEGER, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))');
    }

    async addColumn(table, column, type) {
        return this.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
    }

    async createTables() {
        await this.createUsersTable();
        await this.createCardsTable();
        await this.createTransactionsTable();
        await this.createBalanceTable();
    }
}

exports.SqliteHelper = SqliteEntity;
