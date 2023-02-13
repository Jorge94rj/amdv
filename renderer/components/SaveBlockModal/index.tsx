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
  const { channelId, dayId, channelDayId } = router.query;
  const {id, name, content_id, start_time, end_time, len} = block || {};
  const inputFileRef = useRef<HTMLInputElement>(null);

  // const [minStartTime, setMinStartTime] = useState('00:00');
  const [availableDirs, setAvailableDirs] = useState([]);
  const [media, setMedia] = useState<IMedia[]>([]);

  const [form, setForm] = useState({
    id: id || null,
    name: name || '',
    start_time: start_time || minStartTime,
    end_time: end_time || '',
    len: len || 2,
    channel_day_id: channelDayId,
    duration: '',
    content_id: content_id || ''
  });

  useEffect(() => {
    getDirs();
    const current = inputFileRef.current;
    if (current !== null) {
      current.setAttribute('directory', '');
      current.setAttribute('webkitdirectory', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputFileRef]);

  const getDirs = () => {
    ipcRenderer.send('send-get-dirs');
    ipcRenderer.once('reply-get-dirs', async (event, data) => {
      console.log('data=>', data)
      setAvailableDirs(data.dirs);
      // toggleBlocking(false);
    });
  }

  const handleChange = (e: HandleEventChangeInterface) => {
    const { value, name } = e.target;
    setForm({
      ...form,
      [name]: value
    })
  }

  const handleStartTimeChange = (e: HandleEventChangeInterface) => {
    const { value, name } = e.target;
    setForm({
      ...form,
      [name]: value,
      ['content_id']: '',
      ['end_time']: ''
    });
  }

  const onDirSelected = (e) => {
    const dirInfo = availableDirs.find(d => d.id.toString() === e.target.value)
    const offset = dirInfo.avg_duration;
    const now = new Date(`1994-10-19T${form.start_time}:00`);
    now.setMinutes(now.getMinutes() + (offset * form.len));
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const blockDuration = `${hours < 10 ? ('0' + hours) : hours}:${minutes < 10 ? ('0' + minutes): minutes}`;
    setForm({
      ...form,
      ['content_id']: e.target.value,
      ['end_time']: blockDuration
    })
  }

  const handleSubmit = async (e: Event & FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!id) {
      toggleBlocking(true);
      ipcRenderer.send('send-create-block', {...form, media});
      toggleBlocking(false);
      onClose(true);
    } else {
      toggleBlocking(true);
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
        <input name="start_time" type="time" value={form.start_time} onChange={handleStartTimeChange} />
      </RowItem>
      <RowItem>
        <label>End time</label>
      </RowItem>
      <RowItem>
        <span style={{'color': '#cccccc'}}>
          {form.end_time ? form.end_time : 'Select directory to estimate end time'}
        </span>
      </RowItem>
      <RowItem>
        <label>Available directories</label>
      </RowItem>
      <RowItem>
        <select name='content_id' onChange={onDirSelected} value={form.content_id}>
          <option value='' disabled>Select media</option>
          {
            availableDirs.map(d => (
              <option key={d.id} value={d.id}>{d.name} [{d.avg_duration} min]</option>
            ))
          }                    
        </select>
        {/* <input name="len" type="number" min={1} value={form.len} onChange={handleChange} /> */}
      </RowItem>
      <RowItem>
        <label>Items to play</label>
      </RowItem>
      <RowItem>
        <input name="len" type="number" min={1} value={form.len} onChange={handleChange} />
      </RowItem>
      {/* <RowItem>
        <label>Media duration (default is automatic or 25)</label>
      </RowItem>
      <RowItem>
        <input name="duration" type="number" value={form.duration} onChange={handleChange} />
      </RowItem> */}
      <RowItem>
        <Button 
          type="submit"
          inverse
          disabled={
            !form.start_time || 
            !form.len || 
            !form.content_id || 
            (form.start_time < minStartTime && !id)
          }>
            Save
        </Button>
      </RowItem>
    </form>
  )
}

export default SaveBlockModal