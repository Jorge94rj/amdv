import { getDBConnection } from '../../db/connect';
import { ipcMain } from 'electron';

let conn = undefined;

const innitConnection = (event) => {
  conn = getDBConnection();
  if (!conn) {
    event.reply("reply-days", { error: "Need to create DB first" });
  }
};

export const sendChannels = ipcMain.on('send-channels', (event, arg) => {
  try {
    innitConnection(event);
    conn?.all('SELECT * FROM channel', (err,rows) => {
      event.reply('reply-channels', (err && err.message) || rows)
      // conn?.close();
    });
  } catch (error) {
    console.log('error', error)
    event.reply('reply-channels', []);
  }
});

export const createChannel = ipcMain.on('send-create-channel', (event, arg) => {
  console.log('ARG=>', arg);
  try {
    innitConnection(event);
    const channel = arg;
    conn?.run('INSERT INTO channel(name) VALUES (?)', [channel.name], function err() {
      createDays(this.lastID)
    })
    conn?.close();
    event.reply('reply-create-channel', channel);
  } catch (error) {
    event.reply('reply-create-channel', error);
  }
})

async function createDays(channelId) {
  const queries = conn?.prepare('INSERT INTO day (day,channel_id) VALUES (?,?)');
  for (let i = 0; i < 7; i++) {
    queries?.run([i,channelId]);
  }
  queries?.finalize();
}
