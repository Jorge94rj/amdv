import { ipcMain } from "electron";
import { getDBConnection } from "../../db/connect";

let conn = undefined;

const innitConnection = (event) => {
  conn = getDBConnection();
  if (!conn) {
    event.reply("reply-days", { error: "Need to create DB first" });
  }
};

export const sendDays = ipcMain.on("send-days", (event, channelId) => {
  try {
    innitConnection(event);
    conn?.all(
      "SELECT * FROM channel_day cd INNER JOIN day d ON cd.day_id = d.id WHERE channel_id= ?",
      [channelId],
      (err, rows) => {
        // conn?.close();
        console.log('reply-days', rows)
        event.reply("reply-days", { days: rows });
      }
    );
  } catch (error) {
    event.reply("reply-days", error);
  }
});

// async function getDays(req:NextApiRequest, res: NextApiResponse) {
//   try {
//     const { query: {channelId} } = req;
//     conn?.all('SELECT * FROM day WHERE channel_id= ?', [channelId], (err,rows) => {
//       conn?.close();
//       return res.status(StatusCode.success).json({
//         success: true,
//         message: `Available days for channel ${channelId}`,
//         days: rows
//       });
//     });
//   } catch (error) {
//     return res.status(StatusCode.fail).json({ success: false, error });
//   }
// }
