import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { DynamicModal } from "../../../components/Modal"
import SaveBlockModal from "../../../components/SaveBlockModal"
import { Button } from "../../../styles/form.style"
import { dayNames, IBlock } from "../../../types"
import { ActionHeader, BlockItem, BlockList, ButtonItem, LeftContent, RightContent } from "../../../styled-components/block.style"
import Image from "next/image";
import EditIcon from '../../../public/edit.svg';
import CloseIcon from '../../../public/trash.svg';
import { useBlockUI } from "../../../components/AppProviders/BlockUIProvider"
import Swal from "sweetalert2"
import { ipcRenderer } from "electron"

const Block = () => {
  const router = useRouter();
  const { toggleBlocking } = useBlockUI();
  const { channelId, dayId, dayName } = router.query;

  const [minStartTime, setMinStartTime] = useState('00:00');
  const [selectedBlock, setSelectedBlock] = useState<IBlock>();
  const [blocks, setBlocks] = useState<IBlock[]>([]);

  useEffect(() => {
    if (dayId) {
      getBlocks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayId])

  const getBlocks = async () => {
    toggleBlocking(true);
    ipcRenderer.send('send-blocks', dayId);
    ipcRenderer.once('reply-blocks', (event, data) => {
      const b = data.blocks || [];
      setBlocks([...b]);
      setMinStartTime(data.minStartTime);
      toggleBlocking(false);
    });
  }

  const [openedSaveBlockModal, setOpenedSaveBlocklModal] = useState(false);
  const openSaveBlocklModal = () => {
    setOpenedSaveBlocklModal(true);
  }
  const closeSaveBlockModal = (saved?: boolean) => {
    if (saved) {
      ipcRenderer.once('reply-create-block', (event, data) => {
        toggleBlocking(false);
        getBlocks();
      });
    } else {
      ipcRenderer.once('reply-update-block', (event, data) => {
        toggleBlocking(false);
        getBlocks();
      });
    }
    setOpenedSaveBlocklModal(false);
    setSelectedBlock({});
  }

  const updateBlock = (block: IBlock) => {
    setSelectedBlock(block);
    openSaveBlocklModal();
  }

  const deleteBlock = async (blockId: number) => {
    const confirm = await Swal.fire({
      title: 'Warning',
      text: 'Are you sure you want to delete THIS Block?',
      showCancelButton: true
    });

    if (!confirm.isConfirmed) {
      return;
    }

    toggleBlocking(true);
    // const req = await fetch(`/api/block/${dayId}/${blockId}`, {
    //   method: 'DELETE',
    //   headers: {
    //     'Content-type': 'application/json'
    //   },
    // });
    ipcRenderer.send('send-delete-block', blockId);
    ipcRenderer.once('reply-delete-block', (event, data) => {
      console.log('data=>', data);
      toggleBlocking(false);
      getBlocks();
    });

    // const res = await req.json();
    // toggleBlocking(false);
    // getBlocks();
  }

  const resetBlocks = async () => {
    const confirm = await Swal.fire({
      title: 'Warning',
      text: 'Are you sure you want to delete ALL Blocks?',
      showCancelButton: true
    });

    if (!confirm.isConfirmed) {
      return;
    }
    
    toggleBlocking(true);
    ipcRenderer.send('send-delete-blocks', dayId);
    ipcRenderer.once('reply-delete-blocks', (event, data) => {
      console.log('data=>', data);
      toggleBlocking(false);
      getBlocks();
    });

  }

  return (
    <>
      <h3>Blocks for {dayName}</h3>
      <ActionHeader>
        <Button onClick={openSaveBlocklModal} disabled={minStartTime > '23:59'}>
          Add
        </Button>
        <Button onClick={resetBlocks} disabled={blocks.length == 0}>
          Reset blocks
        </Button>
      </ActionHeader>
      <BlockList>
        {blocks.map((b) => (
          <BlockItem key={b.id}>
            <LeftContent>
              <label>{b.name || 'Untitled'}</label>
            </LeftContent>
            <RightContent>
              <label>Starts at: {b.start_time}</label>
              <label>Count: {b.len}</label>
              <ButtonItem>
                <Image src={EditIcon} onClick={() => updateBlock(b)} />
              </ButtonItem>
              <ButtonItem onClick={() => deleteBlock(b.id)}>
                <Image src={CloseIcon} />
              </ButtonItem>
            </RightContent>
          </BlockItem>
        ))}
      </BlockList>
      <DynamicModal open={openedSaveBlockModal} onClose={closeSaveBlockModal} width="600px" height="460px">
        <SaveBlockModal block={selectedBlock} minStartTime={minStartTime} onClose={closeSaveBlockModal} />
      </DynamicModal>
    </>
  )
}

export default Block