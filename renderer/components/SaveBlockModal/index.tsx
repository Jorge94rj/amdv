import { ChangeEvent, ChangeEventHandler, FormEvent, useEffect, useRef, useState } from 'react';
import { HandleEventChangeInterface, IBlock, IMedia } from '../../types';
import { Button, RowItem } from '../../styles/form.style';
import { useRouter } from 'next/router';
import { PathSelector } from './index.style';
import { useBlockUI } from '../AppProviders/BlockUIProvider';
import { ipcRenderer } from 'electron';

interface ISaveBlockProps {
  block?: IBlock;
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

const SaveBlockModal = ({ block, onClose, minStartTime }: ISaveBlockProps) => {
  const router = useRouter();
  const { toggleBlocking } = useBlockUI();
  const { channelId, dayId } = router.query;
  const {id, name, start_time, len} = block || {};
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [media, setMedia] = useState<IMedia[]>([]);

  const [form, setForm] = useState({
    id: id || null,
    name: name || '',
    start_time: start_time || minStartTime,
    len: len || 1,
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
    if (files) {
      for (const file in files) {
        const fileObj = files[file] as File & {path: 'string'};
        const filename = fileObj.name;
        if (filename) {
          const ext = filename.split('.')[1]?.toUpperCase()
          if (supportedMedia.indexOf(ext) !== -1 && fileObj?.webkitRelativePath && fileObj.name !== '.DS_Store') {
            const relativepathArr = fileObj.webkitRelativePath.split('/');
            relativepathArr.pop();
            const relativepath = relativepathArr.join('/').concat('/');
            media.push({
              fullpath: fileObj.path,
              path: relativepath,
              filename,
              duration: 0,
              played: 0
            })
          }
        }
      }
    }
    const sorted = media.sort((a,b) => (a.filename > b.filename) ? 1 : ((b.filename > a.filename) ? -1 : 0));
    setMedia([...sorted]);
  }

  const handleSubmit = async (e: Event & FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!id) {
      toggleBlocking(true);
      // const req = await fetch('/api/block', {
        //   method: 'POST',
        //   headers: {
          //     'Content-type': 'application/json'
          //   },
          //   body: JSON.stringify({ ...form, media })
          // });
          // await req.json();
      ipcRenderer.send('send-create-block', {...form, media});
      toggleBlocking(false);
      onClose(true);
    } else {
      toggleBlocking(true);
      // const req = await fetch(`/api/block/${dayId}/${id}`, {
        //   method: 'PUT',
        //   headers: {
          //     'Content-type': 'application/json'
          //   },
          //   body: JSON.stringify({ ...form, media })
          // });
          // await req.json();
      ipcRenderer.send('send-update-block', {...form, media, blockId: id});
      toggleBlocking(false);
      onClose(false);
    }
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
        <input name="start_time" type="time" value={form.start_time} onChange={handleChange} />
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
            multiple
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
            !form.start_time || 
            !form.len || 
            (media.length == 0 && !id) || 
            (form.start_time < minStartTime && !id)
          }>
            Save
        </Button>
      </RowItem>
    </form>
  )
}

export default SaveBlockModal