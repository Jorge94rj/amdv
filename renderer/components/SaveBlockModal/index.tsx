import { ChangeEvent, ChangeEventHandler, FormEvent, useEffect, useRef, useState } from 'react';
import { HandleEventChangeInterface, IBlock, IMedia } from '../../types';
import { Button, RowItem } from '../../styles/form.style';
import { useRouter } from 'next/router';
import { PathSelector } from './index.style';

interface ISaveBlockProps {
  onClose: (open: boolean) => void;
  minStartTime: string;
}

const supportedMedia = [
  'AVI', 'MPEG', 'WMV', 'ASF', 'FLV', 'MKV', 'MKA',
  'MP4', 'M4A', 'AAC', 'NUT', 'OGG', 'OGM', 'MOV',
  'RAM', 'RM', 'RV', 'RA', 'RMVB', '3GP', 'VIVO', 'PVA',
  'NUV', 'NSV', 'NSA', 'FLI', 'FLC', 'DVR-MS', 'WTV', 'TRP',
  'F4V'
];

const SaveBlockModal = ({ onClose, minStartTime }: ISaveBlockProps) => {
  const router = useRouter();
  const { channelId, dayId } = router.query;
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [media, setMedia] = useState<IMedia[]>([]);

  const [form, setForm] = useState({
    name: '',
    start_time: minStartTime,
    len: 1,
    day_id: dayId,
  });

  useEffect(() => {
    const current = inputFileRef.current;
    if (current !== null) {
      current.setAttribute('directory', '');
      current.setAttribute('webkitdirectory', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputFileRef]);

  const handleChange = (e: HandleEventChangeInterface) => {
    const { value, name } = e.target;
    setForm({
      ...form,
      [name]: value
    })
  }

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    setMedia([]);
    const files = e.target.files;
    let order = 0;
    if (files) {
      for (const file in files) {
        const fileObj = files[file] as File & {path: 'string'};
        const filename = fileObj.name;
        if (filename) {
          const ext = filename.split('.')[1]?.toUpperCase()
          if (supportedMedia.indexOf(ext) !== -1 && fileObj?.webkitRelativePath && fileObj.name !== '.DS_Store') {
            console.log('real_path->', fileObj.path)
            const path = fileObj.webkitRelativePath.split('/');
            path.pop();
            const trimmedPath = path.join('/').concat('/');

            const video = document.createElement('video');
            video.preload = 'metadata'
            video.src = URL.createObjectURL(fileObj)
            video.onloadedmetadata = async () => {
              window.URL.revokeObjectURL(video.src);
              const order = Number(video.getAttribute('order'));
              const duration = Math.round(video.duration / 60);
              media[order].duration = duration;
            }
            video.setAttribute('order', order.toString())
            media.push({
              path: trimmedPath,
              filename: filename,
              duration: 0,
              played: 0
            })
            order++;
          }
        }
      }
    }
    setMedia([...media]);
  }

  const handleSubmit = async (e: Event & FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const req = await fetch('/api/block', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ ...form, media })
    });
    await req.json();
    onClose(true);
  }

  return (
    <form onSubmit={handleSubmit}>
      <RowItem>
        <label>Name</label>
      </RowItem>
      <RowItem>
        <input name="name" type="text" value={form.name} onChange={handleChange} />
      </RowItem>
      <RowItem>
        <label>Start time</label>
      </RowItem>
      <RowItem>
        <input name="start_time" type="time" min={minStartTime} value={form.start_time} onChange={handleChange} />
      </RowItem>
      <RowItem>
        <label>Path</label>
      </RowItem>
      <RowItem>
        <PathSelector onClick={() => inputFileRef?.current?.click()}>
          <label>Click here to choose a file</label>
          <input
            ref={inputFileRef}
            name="path"
            type="file"
            accept="video/mp4,video/x-m4v,video/*"
            onChange={handleFile} />
        </PathSelector>
      </RowItem>
      <RowItem>
        <label>Items to play</label>
      </RowItem>
      <RowItem>
        <input name="len" type="number" min={1} value={form.len} onChange={handleChange} />
      </RowItem>
      <RowItem>
        <Button 
          type="submit"
          inverse
          disabled={
            !form.start_time || !form.len || media.length == 0 || form.start_time < minStartTime}>
            Save
        </Button>
      </RowItem>
    </form>
  )
}

export default SaveBlockModal