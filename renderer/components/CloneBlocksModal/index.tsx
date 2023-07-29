import { ChangeEvent, ChangeEventHandler, FormEvent, useEffect, useRef, useState } from 'react';
import { dayNames, HandleEventChangeInterface, IBlock, IMedia } from '../../types';
import { Button, RowItem } from '../../styles/form.style';
import { useRouter } from 'next/router';
import { useBlockUI } from '../AppProviders/BlockUIProvider';
import { ipcRenderer } from 'electron';

interface ISaveBlockProps {
  block?: IBlock;
  onClose: (open: boolean) => void;
}

const CloneBlockModal = ({onClose}:ISaveBlockProps) => {

  const {query} = useRouter();
  const {channelId, channelDayId} = query;
  const [channelBlocks, setChannelBlocks] = useState([]);

  const [form, setForm] = useState({
    channel_day_id: '',
  });

  useEffect(() => {
    getChannelBlocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getChannelBlocks = () => {
    ipcRenderer.send('send-get-channel-blocks', channelId);
    ipcRenderer.once('reply-get-channel-blocks', async (event, data) => {
      console.log('data=>', data)
      setChannelBlocks(data.blocks);
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

  const handleSubmit = async (e: Event & FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    ipcRenderer.send('send-clone-block', {channelDayId, cloneId: form.channel_day_id});
    ipcRenderer.on('reply-clone-block', (event, data) => {
      onClose(true);
      console.log('data_from_block=>', data);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <RowItem>
        <label>Available blocks</label>
      </RowItem>
      <RowItem>
        <select name='channel_day_id' onChange={handleChange} value={form.channel_day_id}>
          <option value='' disabled>Clone blocks from</option>
          {
            channelBlocks.map(d => (
              <option key={d.channel_day_id} value={d.channel_day_id}>{dayNames[d.day as keyof {}]}</option>
            ))
          }                    
        </select>
        {/* <input name="len" type="number" min={1} value={form.len} onChange={handleChange} /> */}
      </RowItem>
      <RowItem>
        <Button 
          type="submit"
          inverse
          disabled={
            !form.channel_day_id
          }>
            Save
        </Button>
      </RowItem>
    </form>
  )
}

export default CloneBlockModal