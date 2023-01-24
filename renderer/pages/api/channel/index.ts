// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Database } from 'sqlite3';
import { getDBConnection } from '../../../db/connect';
import { ResponseData, StatusCode } from '../../../types';

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
    case 'GET':
      getChannels(res);
      break;
    case 'POST':
      createChannel(res, body);
      break;
    default:
      return res
        .status(StatusCode.fail)
        .json({ success: false, error: 'Server failed' });
  }
}

async function getChannels(res: NextApiResponse) {
  try {
    conn?.all('SELECT * FROM channel', (err,rows) => {
      conn?.close();
      return res.status(StatusCode.success).json({ success: true, message: '', channels: rows });
    });
  } catch (error) {
    return res.status(StatusCode.fail).json({ success: false, error });
  }
}

async function createChannel(
  res: NextApiResponse,
  body
) {
  try {
    const channel = JSON.parse(body as unknown as string);
    conn?.run('INSERT INTO channel(name) VALUES (?)', [channel.name], function err() {
      createDays(this.lastID)
    })
    conn?.close();
    return res.status(StatusCode.success).json({ success: true, channel });
  } catch (error) {
    return res.status(StatusCode.fail).json({ success: false, error });
  }
}

async function createDays(channelId: number) {
  const queries = conn?.prepare('INSERT INTO day (day,channel_id) VALUES (?,?)');
  for (let i = 0; i < 7; i++) {
    queries?.run([i,channelId]);
  }
  queries?.finalize();
}
