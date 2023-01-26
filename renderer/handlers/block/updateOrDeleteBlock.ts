import { ipcMain } from "electron";
import { getDBConnection } from "../../db/connect";
import { createMedia } from "../../utils/shared-queries/createMedia";

let conn = undefined;

const innitConnection = (event) => {
  conn = getDBConnection();
  if (!conn) {
    event.reply('reply-create-block', { error: 'Need to create DB first' });
  }
};

export const updateBlock = ipcMain.on('send-update-block', (event, block) => {
  try {
    innitConnection(event);
    const {blockId, name, start_time, len, media} = block;
    conn?.run('UPDATE block SET name=?, start_time=?, len=? WHERE id=?',
    [name,start_time,len,blockId]);
    if (media && media.length) {
      conn?.run('DELETE FROM media WHERE block_id=?', [blockId], async () => {
        await createMedia(conn, blockId, media);
      });
    }
    event.reply('reply-update-block', { message: 'Block updated succesfully' });
  } catch (error) {
    event.reply('reply-update-block', error);
  }
});

export const deleteBlock = ipcMain.on('send-delete-block', (event, blockId) => {
  try {
    innitConnection(event);
    conn?.run('DELETE FROM block WHERE id=?',[blockId]);
    event.reply('reply-delete-block', { message: 'Block deleted succesfully' });
  } catch (error) {
    event.reply('reply-delete-block', error);
  }
});

// async function updateBlock(res: NextApiResponse, blockId: number, body) {
//   try {
//     const {name, start_time, len, media} = body;
//     conn?.run('UPDATE block SET name=?, start_time=?, len=? WHERE id=?',
//     [name,start_time,len,blockId]);
//     if (media && media.length) {
//       conn?.run('DELETE FROM media WHERE block_id=?', [blockId], async () => {
//         await createMedia(conn, blockId, media);
//       });
//     }
//     return res.status(StatusCode.success).json({ success: true, message: 'Block updated succesfully' });
//   } catch (error) {
//     res.status(StatusCode.fail).json({ success: false, error });
//   }
// }

// async function deleteBlock(res: NextApiResponse, blockId: number) {
//   try {
//     conn?.run('DELETE FROM block WHERE id=?',[blockId]);
//     return res.status(StatusCode.success).json({ success: true, message: 'Block deleted succesfully' });
//   } catch (error) {
//     res.status(StatusCode.fail).json({ success: false, error });
//   }
// }
