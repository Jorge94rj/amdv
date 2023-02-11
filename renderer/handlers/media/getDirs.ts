import { ipcMain } from "electron";
import { getDBConnection } from "../../db/connect";

let conn = undefined;

const innitConnection = (event) => {
  conn = getDBConnection();
  if (!conn) {
    event.reply("reply-get-dirs", { error: "Need to create DB first" });
  }
};

export const getDirs = ipcMain.on('send-get-dirs', (event, arg) => {
  try {
    innitConnection(event);
    conn?.all("SELECT * FROM content", (err, rows) => {
        event.reply("reply-get-dirs", {dirs: rows});
    });
  } catch (error) {
    event.reply("reply-get-dirs", error);
  }
})