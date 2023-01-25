import { ipcRenderer } from "electron";
import { FormEvent, useRef, useState } from "react";
import { Button, Legend, Remark, RowItem } from "../../styles/form.style";
import { HandleEventChangeInterface } from "../../types";
import { useBlockUI } from "../AppProviders/BlockUIProvider";
import Icon from "../Icon";
import { IconWrapper } from "./index.style";

interface ISaveChannelProps {
  onClose: (open: boolean) => void;
}

const SaveChannelModal = ({onClose}: ISaveChannelProps) => {
  const { toggleBlocking } = useBlockUI();
  const [form, setForm] = useState({
    name: '',
  });

  const [file, setFile] = useState<File>();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async(e: Event & FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toggleBlocking(true);
    ipcRenderer.send('send-create-channel', form);
    ipcRenderer.once('reply-create-channel', () => {
      toggleBlocking(false);
      onClose(true);
    });
  }

  const handleChange = (e: HandleEventChangeInterface) => {
    const { value, name } = e.target;
    setForm({
      ...form,
      [name]: value
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <RowItem>
        <label>Channel name</label>
      </RowItem>
      <RowItem>
        <input name="name" type="text" value={form.name} onChange={handleChange} />
      </RowItem>
      <Legend>
        If you want custom <Remark>thumbnail</Remark> and <Remark>fanart</Remark> name them with this 
        format 
        <br/> <Remark>thumbnail.[channelId]</Remark> (without brackets)
        <br/> <Remark>fanart.[channelId]</Remark> (without brackets) 
        <br/> into a zip folder
      </Legend>
      <RowItem>
        <Button type="submit" inverse disabled={!form.name}>Save</Button>
      </RowItem>
    </form>
  )
}

export default SaveChannelModal;