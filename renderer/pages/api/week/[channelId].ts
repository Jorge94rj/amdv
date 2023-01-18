// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { UpdateQuery } from 'mongoose';
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

  const { method } = req;

  switch (method) {
    case 'GET':
      getDays(req,res);
      break;
    default:
      return res
        .status(StatusCode.fail)
        .json({ success: false, error: 'Server failed' });
  }
}

async function getDays(req:NextApiRequest, res: NextApiResponse) {
  try {
    const { query: {channelId} } = req;
    conn?.all('SELECT * FROM day WHERE channel_id= ?', [channelId], (err,rows) => {
      conn?.close();
      return res.status(StatusCode.success).json({ 
        success: true,
        message: `Available days for channel ${channelId}`,
        days: rows 
      });
    });
  } catch (error) {
    return res.status(StatusCode.fail).json({ success: false, error });
  }
}
