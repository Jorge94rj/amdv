import fs from 'fs';

const sqlite3 = require('sqlite3').verbose();

export const DB_NAME = './renderer/db/airlike.db';

export function getDBConnection() {
    if (fs.existsSync(DB_NAME)) {
        const conn = new sqlite3.Database(DB_NAME);
        conn.exec('PRAGMA foreign_keys=ON')
        return conn;
    } else {
        null;
    }
}

