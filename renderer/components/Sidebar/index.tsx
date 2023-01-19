import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { Button, RowItem } from "../../styles/form.style"
import { IChannel } from "../../types";
import { useBlockUI } from "../AppProviders/BlockUIProvider";
import { DynamicModal } from "../Modal";
import SaveChannelModal from "../SaveChannelModal";
import { ChannelItem, ChannelList, HeaderItem, HeaderWrapper, RowSection } from "./index.style"

const Sidebar = () => {
  const router = useRouter();
  const { toggleBlocking } = useBlockUI();
  const { channelId } = router.query;

  const [channels, setChannels] = useState<IChannel[]>([]);

  const [openedSaveChannelModal, setOpenedSaveChannelModal] = useState(false);
  const openSaveChannelModal = () => setOpenedSaveChannelModal(true);
  const closeSaveChannelModal = (saved?: boolean) => {
    setOpenedSaveChannelModal(false);
    if (saved) {
      getChannels();
    }
  }

  useEffect(() => {
    getChannels();
  }, []);

  const getChannels = async () => {
    toggleBlocking(true);
    const req = await fetch('/api/channel', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      },
    })
    const data = await req.json();
    const resChannels = data.channels || [];
    setChannels(resChannels)
    toggleBlocking(false);
  }

  return (
    <>
      <HeaderWrapper>
        <HeaderItem>
          <h3>DB</h3>
          <Button onClick={() => router.push('/')}>
            Manage
          </Button>
        </HeaderItem>
        <HeaderItem>
          <h3>Channel list</h3>
          <RowSection>
            <Button onClick={getChannels}>
              Refresh
            </Button>
            <Button onClick={openSaveChannelModal}>
              Add
            </Button>
          </RowSection>
        </HeaderItem>
      </HeaderWrapper>
      <ChannelList>
        {
          channels.map(c => (
            <ChannelItem
              key={c.id}
              active={c.id.toString() === channelId}
              onClick={() => router.push(`/week/${c.id}`)}>
              {c.name}
            </ChannelItem>
          ))
        }
      </ChannelList>
      <DynamicModal open={openedSaveChannelModal} onClose={closeSaveChannelModal} width="660px" height="320px">
        <SaveChannelModal onClose={closeSaveChannelModal} />
      </DynamicModal>
    </>
  )
}

export default Sidebar