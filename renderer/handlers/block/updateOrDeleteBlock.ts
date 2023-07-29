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
    const {blockId, name, start_time, len, media, duration} = block;
    conn?.run('UPDATE block SET name=?, start_time=?, len=? WHERE id=?',
    [name,start_time,len,blockId]);
    if (media && media.length) {
      conn?.run('DELETE FROM media WHERE block_id=?', [blockId], async () => {
        await createMedia(conn, blockId, media, duration);
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
