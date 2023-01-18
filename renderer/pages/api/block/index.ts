// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Database } from 'sqlite3';
import { getDBConnection } from '../../../db/connect';
import { IBlock, IMedia, ResponseData, StatusCode } from '../../../types';
import { createMedia } from '../../../utils/shared-queries/createMedia';

let conn: Database | undefined = undefined;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {

  conn = getDBConnection();
  if (!conn) {
    return res.status(StatusCode.success).json({ 
      success: true, 
      message: 'Need to create DB first' 
    });
  }

  const { method, body } = req;

  switch (method) {
    case 'POST':
      createBlock(res, body);
      break;
    default:
      return res
        .status(StatusCode.fail)
        .json({ success: false, error: 'Server failed' });
  }
}

async function createBlock(
  res: NextApiResponse,
  body: IBlock & { media }
) {
  try {
    const block = body;
    const { name, start_time, len, day_id, media } = block;
    conn?.run('INSERT INTO block(name, start_time, len, day_id) VALUES (?,?,?,?)', 
    [name, start_time, len, day_id], async function err() {
      await createMedia(conn,this.lastID, media)
      conn?.close();
      return res.status(StatusCode.success).json({ success: true, block });
    })
  } catch (error) {
    return res.status(StatusCode.fail).json({ success: false, error });
  }
}

