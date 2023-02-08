import { getVideoDurationInSeconds } from 'get-video-duration-electron';

export async function createMedia(conn, blockId, media, duration) {
  const queries = conn?.prepare(
    'INSERT INTO media (block_id,path,filename,duration,played) VALUES (?,?,?,?,?)'
  );
  console.log('sent_duration', duration)
  for (const item of media) {
    item.duration = duration || await getDuration(item.fullpath)
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

async function getDuration(path) {
  try {
    const duration = await getVideoDurationInSeconds(path)
    return Math.round(duration / 60);
  } catch(e) {
    return 0;
  }
}