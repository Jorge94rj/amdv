// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Database } from "sqlite3";
import { getDBConnection } from "../../../../db/connect";
import { ResponseData, StatusCode } from "../../../../types";

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
    query: { dayId },
  } = req;

  switch (method) {
    case "GET":
      getBlocksByDayId(res, dayId as unknown as number);
      break;
    // case 'PUT':
    //   updateAsset(res, id as string, body);
    //   break;
    case 'DELETE':
      deleteBlocks(res, dayId as unknown as number);
      break;
    default:
      return res
        .status(StatusCode.fail)
        .json({ success: false, error: "Server failed" });
  }
}

async function getBlocksByDayId(res: NextApiResponse, id: number) {
  try {
    conn?.all("SELECT * FROM block WHERE day_id=?", [id], (err, rows) => {
      let minStartTime = '00:00';
      if(rows.length > 0) {
        const lastItem = rows[rows.length - 1];
        conn?.get(
          "SELECT AVG(duration) as avg FROM block INNER JOIN media m ON block.id=m.block_id WHERE day_id=? AND block.id = ? GROUP BY block.id",
          [lastItem.day_id, lastItem.id],
          function (err, row) {
            // const avgDuration = row.avg;
            const avgDuration = row?.avg && row?.avg > 0 ? row?.avg : 25;
            if (avgDuration) {
              const offset = lastItem.len * avgDuration;
              const now = new Date(`1994-10-19T${lastItem.start_time}:00`);
              now.setMinutes(now.getMinutes() + offset);
              const hours = now.getHours();
              const minutes = now.getMinutes();
              minStartTime = `${hours < 10 ? ('0' + hours) : hours}:${minutes < 10 ? ('0' + minutes): minutes}`;
            }
            conn?.close();
            return res
              .status(StatusCode.success)
              .json({ success: true, message: 'Available blocks', blocks: rows, minStartTime });
          });
        } else {
          conn?.close();
          return res
            .status(StatusCode.success)
            .json({ success: true, message: 'Available blocks', blocks: rows, minStartTime });
        }
    });
  } catch (error) {
    return res.status(StatusCode.fail).json({ success: false, error });
  }
}

async function deleteBlocks(res: NextApiResponse, dayId: number) {
  try {
    conn?.run('DELETE FROM block WHERE day_id=?',[dayId]);
    return res.status(StatusCode.success).json({ success: true, message: 'Blocks deleted succesfully' });
  } catch (error) {
    res.status(StatusCode.fail).json({ success: false, error });
  }
}
