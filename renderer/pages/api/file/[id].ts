// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { UpdateQuery } from 'mongoose';
import { ResponseData, StatusCode } from '../../../types';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

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
      getFileById(res, id as string);
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
    'Content-Type': 'image/png',
    'Content-Length': stat.size
  });
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
};

async function getFileById(
  res: NextApiResponse,
  id: string
) {
  try {
  } catch (error) {
    res.status(StatusCode.fail).json({ success: false, error });
  }
}
