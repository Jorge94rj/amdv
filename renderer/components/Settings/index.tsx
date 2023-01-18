import { Button } from "../../styles/form.style"
import Icon from "../Icon"
import Image from 'next/image';
import { Container } from "./index.style"
import Database from '../../public/database.svg';
import { useRouter } from "next/router";
import Card from "../Card";
import { IconWrapper } from "../Card/index.style";
import DbIcon from '../../public/database.svg';
import ExportIcon from '../../public/export.svg';
import CloseIcon from '../../public/trash.svg';

const Settings = () => {
  const router = useRouter();

  const handleDBcreation = async() => {
    const req = await fetch('/api/settings/create-db', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      },
    })

    const data = await req.json();
  }

  const handleDBdeletion = async () => {
    const req = await fetch('/api/settings/delete-db', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      },
    })

    const data = await req.json();
  }

  const handleDBExport = async () => {
    const req = await fetch('/api/settings/export-db', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      },
    })
    const data = await req.blob();
    const blob = new Blob([data]);
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', 'airlike.db')
    link.onclick = () => {
      setTimeout(() => {
        window.URL.revokeObjectURL(link.href)
      }, 1500);
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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