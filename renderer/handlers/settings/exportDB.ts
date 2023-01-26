import fs from "fs";
import { dialog, ipcMain } from "electron";

export const exportDB = ipcMain.on("send-export-db", (event, arg) => {
  dialog.showSaveDialog({
    title: "Save DB as",
    defaultPath: `${global.usrDataPath}/airlike.db`,
    filters: [{ name: "DB files", extensions: ["db"] }],
  }).then(file => {
    if(!file.canceled) {
      fs.readFile(`${global.usrDataPath}/airlike.db`, (err, data) => {
        if (err) throw err;
        fs.writeFileSync(file.filePath.toString(), data, 'binary');
      });
      // fs.writeFile(file.filePath.toString(), 'DB file', (err) => {
      //   if (err) throw err;
      //   event.reply('reply-export-db', {message: 'DB exported succesfully!'});
      // });
    }
  }).catch(err => {
    alert(err);
  });
});
