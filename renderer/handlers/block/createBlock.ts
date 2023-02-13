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
    const { name, start_time, end_time, content_id, len, channel_day_id } = block;
    conn?.run('INSERT INTO block(name, start_time, end_time, content_id, len) VALUES (?,?,?,?,?)', 
    [name, start_time, end_time, content_id, len], async function err() {
      conn?.run('INSERT INTO channel_day_block(channel_day_id, block_id) VALUES (?,?)', [channel_day_id, this.lastID])
      conn?.close();
      event.reply('reply-create-block', {id: this.lastID});
    });
  } catch (error) {
    event.reply('reply-create-block', error);
  }
});


