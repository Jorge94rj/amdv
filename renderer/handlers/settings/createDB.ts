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
      day INTEGER
    );
  `,
  `
    CREATE TABLE block(
      id INTEGER PRIMARY KEY,
      name TEXT,
      day_id INTEGER,
      start_time TEXT,
      end_time TEXT,
      content_id INTEGER,
      len INTEGER,
      FOREIGN KEY (day_id) REFERENCES day (id)
      ON DELETE CASCADE,
      FOREIGN KEY (content_id) REFERENCES content (id)
      ON DELETE CASCADE
    );
  `,
  `
    CREATE TABLE content(
      id INTEGER PRIMARY KEY,
      name INTEGER,
      avg_duration INTEGER
    );
  `,
  `
    CREATE TABLE media(
      id INTEGER PRIMARY KEY,
      block_id INTEGER,
      content_id INTEGER,
      path TEXT,
      filename TEXT,
      duration INTEGER,
      last_date_played TEXT,
      played INTEGER,
      FOREIGN KEY (block_id) REFERENCES block (id)
      ON DELETE CASCADE,
      FOREIGN KEY (content_id) REFERENCES content (id)
      ON DELETE CASCADE
    );
  `,
  `
    CREATE TABLE channel_day(
      id INTEGER PRIMARY KEY,
      channel_id INTEGER,
      day_id INTEGER,
      FOREIGN KEY (channel_id) REFERENCES channel (id)
      ON DELETE CASCADE,
      FOREIGN KEY (day_id) REFERENCES day (id)
      ON DELETE CASCADE
    );
  `,
  `
    CREATE TABLE channel_day_block(
      id INTEGER PRIMARY KEY,
      channel_day_id INTEGER,
      block_id INTEGER,
      FOREIGN KEY (channel_day_id) REFERENCES channel_day (id)
      ON DELETE CASCADE,
      FOREIGN KEY (block_id) REFERENCES block (id)
      ON DELETE CASCADE
    );
  `,
  `INSERT INTO day(day) VALUES (0);`,
  `INSERT INTO day(day) VALUES (1);`,
  `INSERT INTO day(day) VALUES (2);`,
  `INSERT INTO day(day) VALUES (3);`,
  `INSERT INTO day(day) VALUES (4);`,
  `INSERT INTO day(day) VALUES (5);`,
  `INSERT INTO day(day) VALUES (6);`,
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

export const isDBAvailable = ipcMain.on('send-available-db', (event, arg) => {
  const DB_NAME = `${global.usrDataPath}/airlike.db`;
  try {
    if (fs.existsSync(DB_NAME)) {
      event.reply('reply-available-db', true);
    } else {
      event.reply('reply-available-db', false);
    }
  } catch (error) {
    event.reply('reply-available-db', false);
  }
});

