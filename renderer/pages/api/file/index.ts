import { NextApiRequest, NextApiResponse } from 'next';
import { FileResponseData, ResponseData, StatusCode } from '../../../types';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadsPath = path.join(process.cwd(), '/uploads');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { method } = req;

  switch (method) {
    case 'POST':
      await saveFile(req, res);
      break;
    default:
      return res
        .status(StatusCode.fail)
        .json({ success: false, error: 'Server failed' });
  }
}

const readFile = (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {
    uploadDir: uploadsPath,
    filename: (name, ext, path, form) => path?.originalFilename ?? '',
  };

  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const saveFile = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  try {
    if (!fs.existsSync(uploadsPath)) {
      await fs.mkdirSync(uploadsPath);
    }
    await fs.readdirSync(uploadsPath);
    const fileRead = await readFile(req);
    const file = fileRead.files.file as formidable.File;
    const { originalFilename, filepath } = file;
    const responseData: FileResponseData = {
      success: true,
      message: 'File upload',
      fileName: originalFilename ?? '',
      path: filepath,
    };

    return res.status(StatusCode.success).json(responseData);
  } catch (e) {
    return res
      .status(StatusCode.fail)
      .json({ success: false, message: 'Failed to save file' });
  }
};

export const deleteFile = async (filepath: string) => {
  return fs.unlinkSync(filepath);
}