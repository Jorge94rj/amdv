import { ipcMain } from 'electron';
import fs from 'fs';

export const deleteDB = ipcMain.on('send-delete-db', (event, arg) => {
  const DB_NAME = `${global.usrDataPath}/airlike.db`;
  try {
    if (fs.existsSync(DB_NAME)) {
      fs.unlinkSync(DB_NAME);
      event.reply('reply-delete-db', {message: 'DB deleted successfully'});
    } else {
      event.reply('reply-delete-db', {message: 'DB does not exist!'});
    }
  } catch (error) {
    event.reply('reply-delete-db', error);
  }
});

