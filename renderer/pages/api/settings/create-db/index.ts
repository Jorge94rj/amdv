// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseData, StatusCode } from "../../../../types";
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { method } = req;

  switch (method) {
    case "GET":
      createDB(res);
      break;
    default:
      return res
        .status(StatusCode.fail)
        .json({ success: false, error: "Server failed" });
  }
}

async function createDB(res: NextApiResponse) {
  try {
    if (fs.existsSync("./renderer/db/airlike.db")) {
      res
        .status(StatusCode.success)
        .json({ success: true, message: "DB already exists!" });
    } else {
      const db = new sqlite3.Database("./renderer/db/airlike.db");
      db.serialize(async () => {
        statements.map(query => db.run(query));
      });
      db.close();
      res.status(StatusCode.success).json({ success: true, message: "DB created succesfully" });
    }
  } catch (error) {
    res.status(StatusCode.fail).json({ success: false, error });
  }
}
