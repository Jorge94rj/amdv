// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { UpdateQuery } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Database } from 'sqlite3';
import { getDBConnection } from '../../../db/connect';
import { IMedia, ResponseData, StatusCode } from '../../../types';

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
  body: UpdateQuery<unknown>
) {
  try {
    const block = body;
    const { name, start_time, len, day_id, media } = block;
    conn?.run('INSERT INTO block(name, start_time, len, day_id) VALUES (?,?,?,?)', 
    [name, start_time, len, day_id], function err() {
      createMedia(this.lastID, media)
    })
    conn?.close();
    return res.status(StatusCode.success).json({ success: true, block });
  } catch (error) {
    return res.status(StatusCode.fail).json({ success: false, error });
  }
}

async function createMedia(blockId: number, media: IMedia[]) {
  const queries = conn?.prepare(
    'INSERT INTO media (block_id,path,filename,duration,played) VALUES (?,?,?,?,?)'
  );
  media.map(m => queries?.run([
    blockId,
    m.path,
    m.filename,
    m.duration > 0 ? m.duration : 25 ,
    m.played]));
  queries?.finalize();
}
