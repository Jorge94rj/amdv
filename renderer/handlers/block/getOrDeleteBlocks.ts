import { ipcMain } from "electron";
import { getDBConnection } from "../../db/connect";

let conn = undefined;

const innitConnection = (event) => {
  conn = getDBConnection();
  if (!conn) {
    event.reply("reply-blocks", { error: "Need to create DB first" });
  }
};

export const sendBlocks = ipcMain.on("send-blocks", (event, dayId) => {
  try {
    innitConnection(event);
    conn?.all("SELECT * FROM block WHERE day_id=?", [dayId], (err, rows) => {
      let minStartTime = '00:00';
      if(rows.length > 0) {
        const lastItem = rows[rows.length - 1];
        conn?.get(
          "SELECT AVG(duration) as avg FROM block INNER JOIN media m ON block.id=m.block_id WHERE day_id=? AND block.id = ? GROUP BY block.id",
          [lastItem.day_id, lastItem.id],
          function (err, row) {
            // const avgDuration = row.avg;
            const avgDuration = row?.avg && row?.avg > 0 ? row?.avg : 25;
            if (avgDuration) {
              const offset = lastItem.len * avgDuration;
              const now = new Date(`1994-10-19T${lastItem.start_time}:00`);
              now.setMinutes(now.getMinutes() + offset);
              const hours = now.getHours();
              const minutes = now.getMinutes();
              minStartTime = `${hours < 10 ? ('0' + hours) : hours}:${minutes < 10 ? ('0' + minutes): minutes}`;
            }
            // conn?.close();
            event.reply("reply-blocks", {blocks: rows, minStartTime});
          });
        } else {
          // conn?.close();
          event.reply("reply-blocks", {blocks: rows, minStartTime});
        }
    });
  } catch (error) {
    event.reply("reply-blocks", error);
  }
});

export const deleteBlocks = ipcMain.on('send-delete-blocks', (event, dayId) => {
    try {
    conn?.run('DELETE FROM block WHERE day_id=?',[dayId]);
    event.reply('reply-delete-blocks', { message: 'Blocks deleted succesfully' });
  } catch (error) {
    event.reply('reply-delete-blocks', error);
  }
});

// async function deleteBlocks(res: NextApiResponse, dayId: number) {
//   try {
//     conn?.run('DELETE FROM block WHERE day_id=?',[dayId]);
//     return res.status(StatusCode.success).json({ success: true, message: 'Blocks deleted succesfully' });
//   } catch (error) {
//     res.status(StatusCode.fail).json({ success: false, error });
//   }
// }
