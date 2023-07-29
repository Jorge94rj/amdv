import { dialog, ipcMain } from 'electron';
import { PythonShell } from 'python-shell';
import fs from 'fs';

function getResPath() {
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    return process.resourcesPath;
  } else {
    return '.'
  }
}

export const scanMedia = ipcMain.on('send-scan-media', (event, arg) => {
  const resPath = getResPath();
  const script = `${resPath}/scripts/media-importer.py`;
  const py = new PythonShell(script);
  dialog.showOpenDialog({
    title: 'Select media path',
    properties: ['openDirectory']
  }).then(file => {
    if(!file.canceled) {
      const selectedDir = file.filePaths.toString();
      const dbDir = `${global.usrDataPath}/airlike.db`;
      py.send([selectedDir, dbDir]);
      py.on('message', (message) => event.reply('reply-scan-media', `{"data":${message}}`));
      py.end((err) => {
        if (err) {
          throw err;
        }
        console.log('finished');
      });
    }else {
      event.reply('reply-scan-media', `{"data":[]}`);
    }
  }).catch(err => {
    alert(err);
    event.reply('reply-scan-media', `{"data":[]}`);
  });
})


