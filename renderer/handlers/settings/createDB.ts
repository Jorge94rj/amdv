import { ipcMain } from "electron";
import fs from "fs";

const sqlite3 = require("sqlite3").verbose();

const statements = [
  `
    PRAGMA foreign_keys = ON;
  `,
  `
    CREATE TABLE channel(
      id INTEGER PRIMARY KEY,
      name TEXT,
      thumbnail TEXT,
      icon TEXT,
      fanart TEXT
    );
  `,
  `
    CREATE TABLE day(
      id INTEGER PRIMARY KEY,
      day INTEGER,
      channel_id INTEGER,
      FOREIGN KEY (channel_id) REFERENCES channel (id)
      ON DELETE CASCADE
    );
  `,
  `
    CREATE TABLE block(
      id INTEGER PRIMARY KEY,
      name TEXT,
      day_id INTEGER,
      start_time TEXT,
      len INTEGER,
      FOREIGN KEY (day_id) REFERENCES day (id)
      ON DELETE CASCADE
    );
  `,
  `
    CREATE TABLE media(
      id INTEGER PRIMARY KEY,
      block_id INTEGER,
      path TEXT,
      filename TEXT,
      duration INTEGER,
      played INTEGER,
      FOREIGN KEY (block_id) REFERENCES block (id)
      ON DELETE CASCADE
    );
  `,
];

export const createDB = ipcMain.on('send-create-db', (event, arg) => {
  const DB_NAME = `${global.usrDataPath}/airlike.db`;
  try {
    if (fs.existsSync(DB_NAME)) {
      event.reply('reply-create-db', {message: 'DB already exists!'});
    } else {
      const db = new sqlite3.Database(DB_NAME);
        db.serialize(async () => {
        statements.map(query => db.run(query));
      });
      db.close();
      event.reply('reply-create-db', {message: 'DB created succesfully'});
    }
  } catch (error) {
    event.reply('reply-create-db', error);
  }
});

