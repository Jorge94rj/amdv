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

export const getChannelBlocks = ipcMain.on('send-get-channel-blocks', (event, channelId) => {
  innitConnection(event);
  try {
    conn?.all(
      `
        SELECT channel_day_id, day FROM channel_day_block cdb
        INNER JOIN channel_day cd ON cdb.channel_day_id = cd.id
        INNER JOIN day d ON cd.day_id = d.id
        WHERE cd.channel_id=?
        GROUP BY day_id
      `, 
      [channelId],
      (err, rows) => {
        // conn?.close();
        event.reply('reply-get-channel-blocks', {blocks: rows});
      }
    );
  } catch (error) {
    event.reply('reply-get-channel-blocks', error);
  }
});

export const cloneBlocks = ipcMain.on('send-clone-block', (event, data) => {
  innitConnection(event);
  try {
    const {channelDayId, cloneId} = data;
    conn?.all(
      `
        SELECT block_id FROM channel_day_block cdb
        WHERE cdb.channel_day_id=?
      `, 
      [cloneId],
      (err, rows) => {
        const queries = conn?.prepare('INSERT INTO channel_day_block(channel_day_id, block_id) VALUES (?,?)');
        rows.map(r => queries.run([channelDayId, r.block_id]))
        queries.finalize();
        event.reply('reply-clone-block', {blocks: rows});
      }
    );
    // conn?.run('INSERT INTO block(name, start_time, end_time, content_id, len) VALUES (?,?,?,?,?)', 
    // [name, start_time, end_time, content_id, len], async function err() {
    //   conn?.run('INSERT INTO channel_day_block(channel_day_id, block_id) VALUES (?,?)', [channel_day_id, this.lastID])
    //   conn?.close();
    //   event.reply('reply-clone-block', {id: this.lastID});
    // });
  } catch (error) {
    event.reply('reply-clone-block', error);
  }
});


