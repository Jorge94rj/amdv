import { ipcMain } from 'electron';
import { getDBConnection } from '../../db/connect';
import { createMedia } from '../../utils/shared-queries/createMedia';

let conn = undefined;

const innitConnection = (event) => {
  conn = getDBConnection();
  if (!conn) {
    event.reply('reply-create-block', { error: 'Need to create DB first' });
  }
};

export const createBlock = ipcMain.on('send-create-block', (event, block) => {
  innitConnection(event);
  try {
    const { name, start_time, len, day_id, duration, media } = block;
    console.log('data_received=>', block);
    conn?.run('INSERT INTO block(name, start_time, len, day_id) VALUES (?,?,?,?)', 
    [name, start_time, len, day_id], async function err() {
      await createMedia(conn,this.lastID, media, duration)
      conn?.close();
      event.reply('reply-create-block', {id: this.lastID});
    });
  } catch (error) {
    event.reply('reply-create-block', error);
  }
});


