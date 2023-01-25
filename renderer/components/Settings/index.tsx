import Image from 'next/image';
import { Container } from "./index.style"
import Card from "../Card";
import { IconWrapper } from "../Card/index.style";
import DbIcon from '../../public/database.svg';
import ExportIcon from '../../public/export.svg';
import CloseIcon from '../../public/trash.svg';
import Swal from "sweetalert2";
import { ipcRenderer } from "electron";

const Settings = () => {
  
  const handleDBcreation = async() => {
    ipcRenderer.send('send-create-db');
    ipcRenderer.once('reply-create-db', (event, data) => {
      console.log('data=>', data);
    });
  }

  const handleDBdeletion = async () => {
    const confirm = await Swal.fire({
      title: 'Warning',
      text: 'Are you sure you want to delete DB?',
      showCancelButton: true
    });

    if (!confirm.isConfirmed) {
      return;
    }

    ipcRenderer.send('send-delete-db');
    ipcRenderer.once('reply-delete-db', (event, data) => {
      console.log('data=>', data);
    });
  }

  const handleDBExport = async () => {
    ipcRenderer.send('send-export-db');
    ipcRenderer.once('reply-export-db', (event, data) => {
      console.log('data=>', data);
    });
  }

  return (
    <Container>
      <Card clickable={true} action={handleDBcreation}>
        Create
        <IconWrapper noMargin={true}>
          <Image
            src={DbIcon}
            alt="type"
            width="64"
            height="64"
          />
        </IconWrapper>
      </Card>
      <Card clickable={true} action={handleDBExport}>
        Export
        <IconWrapper noMargin={true}>
          <Image
            src={ExportIcon}
            alt="type"
            width="64"
            height="64"
          />
        </IconWrapper>
      </Card>
      <Card clickable={true} action={handleDBdeletion}>
        Delete
        <IconWrapper noMargin={true}>
          <Image
            src={CloseIcon}
            alt="type"
            width="64"
            height="64"
          />
        </IconWrapper>
      </Card>
    </Container>
  )
}

export default Settings