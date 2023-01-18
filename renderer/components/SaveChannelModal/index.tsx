import { FormEvent, useRef, useState } from "react";
import { Button, Legend, Remark, RowItem } from "../../styles/form.style";
import { HandleEventChangeInterface } from "../../types";
import Icon from "../Icon";
import { IconWrapper } from "./index.style";

interface ISaveChannelProps {
  onClose: (open: boolean) => void;
}

const SaveChannelModal = ({onClose}: ISaveChannelProps) => {
  const [form, setForm] = useState({
    name: '',
  });

  const [file, setFile] = useState<File>();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async(e: Event & FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const req = await fetch('/api/channel', {
      method: 'POST',
      body: JSON.stringify(form)
    });

    const data = await req.json();
    onClose(true);
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
      {/* <RowItem>
        <label>Type</label>
      </RowItem>
      <RowItem>
        <select name="assetType" value={form.assetType} onChange={handleChange} >
          <option value="" disabled>Select type</option>
          <option value="model">Model</option>
          <option value="image">Image</option>
        </select>
      </RowItem>
      <RowItem>
        <IconWrapper onClick={openFileHandler}>
          <input ref={inputFileRef} type="file" accept="image/png, .gltf" onChange={handleFileChange} />
          <Icon name="upload" color="#fff" />
        </IconWrapper>
      </RowItem>
      <RowItem>
        <Button type="submit" disabled={!form.name || !form.assetType || !file}>Save</Button>
      </RowItem> */}
    </form>
  )
}

export default SaveChannelModal;