// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Database } from "sqlite3";
import { getDBConnection } from "../../../../db/connect";
import { ResponseData, StatusCode } from "../../../../types";
import { createMedia } from "../../../../utils/shared-queries/createMedia";

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("../../airlike.db");

let conn: Database | undefined = undefined;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  conn = getDBConnection();
  if (!conn) {
    return res.status(StatusCode.success).json({
      success: true,
      message: "Need to create DB first",
    });
  }

  const {
    method,
    body,
    query: { blockId },
  } = req;

  switch (method) {
    case 'PUT':
      updateBlock(res, blockId as unknown as number, body);
      break;
    case 'DELETE':
      deleteBlock(res, blockId as unknown as number);
      break;
    default:
      return res
        .status(StatusCode.fail)
        .json({ success: false, error: "Server failed" });
  }
}

async function updateBlock(res: NextApiResponse, blockId: number, body) {
  try {
    const {name, start_time, len, media} = body;
    conn?.run('UPDATE block SET name=?, start_time=?, len=? WHERE id=?',
    [name,start_time,len,blockId]);
    if (media && media.length) {
      conn?.run('DELETE FROM media WHERE block_id=?', [blockId], async () => {
        await createMedia(conn, blockId, media);
      });
    }
    return res.status(StatusCode.success).json({ success: true, message: 'Block updated succesfully' });
  } catch (error) {
    res.status(StatusCode.fail).json({ success: false, error });
  }
}

async function deleteBlock(res: NextApiResponse, blockId: number) {
  try {
    conn?.run('DELETE FROM block WHERE id=?',[blockId]);
    return res.status(StatusCode.success).json({ success: true, message: 'Block deleted succesfully' });
  } catch (error) {
    res.status(StatusCode.fail).json({ success: false, error });
  }
}
