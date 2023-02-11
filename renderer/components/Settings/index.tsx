import Image from 'next/image';
import { Container } from "./index.style"
import Card from "../Card";
import { IconWrapper } from "../Card/index.style";
import DbIcon from '../../public/database.svg';
import ExportIcon from '../../public/export.svg';
import CloseIcon from '../../public/trash.svg';
import Swal from "sweetalert2";
import { ipcRenderer } from "electron";
import { PythonShell } from 'python-shell';
import { useBlockUI } from '../AppProviders/BlockUIProvider';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Settings = () => {
  const router = useRouter();
  const [isDBAvailable, setIsDBAvailable] = useState(false)
  const { toggleBlocking } = useBlockUI();

  useEffect(() => {
    checkDB();
  },[])

  const checkDB = async () => {
    ipcRenderer.send('send-available-db');
    ipcRenderer.once('reply-available-db', (event, data) => {
      setIsDBAvailable(data)
    })
  }
  
  const handleDBcreation = async() => {
    ipcRenderer.send('send-create-db');
    ipcRenderer.once('reply-create-db', (event, data) => {
      console.log('data=>', data);
      checkDB();
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
      checkDB();
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
        Create DB
        <IconWrapper noMargin={true}>
          <Image
            src={DbIcon}
            alt="type"
            width="64"
            height="64"
          />
        </IconWrapper>
      </Card>
      {
        isDBAvailable &&
        <Card clickable={true} action={() => {
          ipcRenderer.send('send-scan-media');
          toggleBlocking(true);
          ipcRenderer.once('reply-scan-media', async (event, data) => {
            console.log(JSON.parse(data))
            const fileList = JSON.parse(data)
            if (fileList.data.length > 0) {
              let info = '';
              fileList.data.map(d => info += d + '<br/>');
              await Swal.fire({
                title: 'Failed to scan duration for these files', 
                html: `<ul style="overflow-y: scroll;max-height:128px;list-style:none"><li>${info}</li></ul>`
              });
            }
            toggleBlocking(false);
          });
        }}>
          Scan media to DB
          <IconWrapper noMargin={true}>
            <Image
              src="https://img.icons8.com/officel/512/not-applicable.png"
              alt="type"
              width="64"
              height="64"
            />
          </IconWrapper>
        </Card>
      }
      {/* {
        isDBAvailable &&
        <Card clickable={true} action={() => router.push('/block')}>
          Create blocks
          <IconWrapper noMargin={true}>
            <Image
              src="https://img.icons8.com/officel/512/not-applicable.png"
              alt="type"
              width="64"
              height="64"
            />
          </IconWrapper>
        </Card>
      } */}
      {
        isDBAvailable &&
        <Card clickable={true} action={handleDBExport}>
          Export DB
          <IconWrapper noMargin={true}>
            <Image
              src={ExportIcon}
              alt="type"
              width="64"
              height="64"
            />
          </IconWrapper>
        </Card>
      }
      {
        isDBAvailable &&
        <Card clickable={true} action={handleDBdeletion}>
          Delete DB
          <IconWrapper noMargin={true}>
            <Image
              src={CloseIcon}
              alt="type"
              width="64"
              height="64"
            />
          </IconWrapper>
        </Card>
      }
    </Container>
  )
}

export default Settings