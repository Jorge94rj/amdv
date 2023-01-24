// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ResponseData, StatusCode } from '../../../../types';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { DB_NAME } from '../../../../db/connect';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {

  const {
    method,
    query: { id },
  } = req;

  switch (method) {
    case 'GET':
      getDBFile(res);
      break;
    default:
      return res
        .status(StatusCode.fail)
        .json({ success: false, error: 'Server failed' });
  }
}

const getFile = async (res: NextApiResponse, filePath: string) => {
  const stat = fs.statSync(filePath);
  res.writeHead(StatusCode.success, {
    'Content-Length': stat.size
  });
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
};

async function getDBFile(
  res: NextApiResponse,
) {
  try {
    const filePath = DB_NAME;
    getFile(res, filePath);
  } catch (error) {
    res.status(StatusCode.fail).json({ success: false, error });
  }
}
