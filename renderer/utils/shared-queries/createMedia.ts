import { IMedia } from "../../types";
import { getVideoDurationInSeconds } from 'get-video-duration-electron';
import { Database } from "sqlite3";

export async function createMedia(conn: Database, blockId: number, media: IMedia[]) {
  const queries = conn?.prepare(
    'INSERT INTO media (block_id,path,filename,duration,played) VALUES (?,?,?,?,?)'
  );
  for (const item of media) {
    item.duration = await getDuration(item.fullpath)
  }
  media.map(m => 
    queries?.run([
      blockId,
      m.path,
      m.filename,
      m.duration ,
      m.played]
  ));
  queries?.finalize();
}

async function getDuration(path: string) {
  try {
    const duration = await getVideoDurationInSeconds(path)
    return Math.round(duration / 60);
  } catch(e) {
    return 25;
  }
}