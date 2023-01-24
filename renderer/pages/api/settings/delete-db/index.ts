// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { ResponseData, StatusCode } from '../../../../types';
import fs from 'fs';
import { DB_NAME } from '../../../../db/connect';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {

  const { method } = req;

  switch (method) {
    case 'GET':
      deleteDB(res);
      break;
    default:
      return res
        .status(StatusCode.fail)
        .json({ success: false, error: 'Server failed' });
  }
}

async function deleteDB(res: NextApiResponse) {
  try {
    if (fs.existsSync(DB_NAME)) {
      fs.unlinkSync(DB_NAME)
      res.status(StatusCode.success).json({ success: true, message: 'DB deleted successfully' });
    } else {
      res.status(StatusCode.success).json({ success: true, message: 'DB does not exist!' });
    }
  } catch (error) {
    res.status(StatusCode.fail).json({ success: false, error });
  }
}

