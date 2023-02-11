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
import CloneBlocksModal from "../../../components/CloneBlocksModal"

const Block = () => {
  const router = useRouter();
  const { toggleBlocking } = useBlockUI();
  const { channelDayId, dayId, channelId } = router.query;

  const [minStartTime, setMinStartTime] = useState('00:00');
  const [selectedBlock, setSelectedBlock] = useState<IBlock>();
  const [blocks, setBlocks] = useState<IBlock[]>([]);

  useEffect(() => {
    getBlocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getBlocks = async () => {
    toggleBlocking(true);
    ipcRenderer.send('send-blocks', {channelId, channelDayId});
    ipcRenderer.once('reply-blocks', (event, data) => {
      const b = data.blocks || [];
      setBlocks([...b]);
      const blocksLen = b.length;
      if (blocksLen > 0) {
        const endTime = b[blocksLen-1].end_time
        setMinStartTime(endTime);
      }
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

  const [openedCloneBlocksModal, setOpenedCloneBlocksModal] = useState(false);
  const openCloneBlocksModal = () => {
    setOpenedCloneBlocksModal(true);
  }
  const closeCloneBlocksModal = (saved) => {
    setOpenedCloneBlocksModal(false);
    if (saved) {
      getBlocks();
    }
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
    ipcRenderer.send('send-delete-block', blockId);
    ipcRenderer.once('reply-delete-block', (event, data) => {
      console.log('data=>', data);
      toggleBlocking(false);
      getBlocks();
    });
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
      <h3>Blocks</h3>
      <ActionHeader>
        <Button onClick={openSaveBlocklModal}>
          Add
        </Button>
        <Button onClick={openCloneBlocksModal}>
          Clone from
        </Button>
        <Button onClick={resetBlocks} disabled={blocks.length == 0}>
          Reset blocks
        </Button>
        {/* <select>
          <option value="" disabled>Clone from</option>
        </select> */}
      </ActionHeader>
      <BlockList>
        {blocks.map((b) => (
          <BlockItem key={b.block_id}>
            <LeftContent>
              <label>{b.name || 'Untitled'}</label>
            </LeftContent>
            <RightContent>
              <label>Starts at: {b.start_time}</label>
              {/* <label>Ends at: {b.end_time}</label> */}
              <label>Count: {b.len}</label>
              <ButtonItem>
                <Image src={EditIcon} onClick={() => updateBlock(b)} />
              </ButtonItem>
              <ButtonItem onClick={() => deleteBlock(b.block_id)}>
                <Image src={CloseIcon} />
              </ButtonItem>
            </RightContent>
          </BlockItem>
        ))}
      </BlockList>
      <DynamicModal open={openedSaveBlockModal} onClose={closeSaveBlockModal} width="600px" height="520px">
        <SaveBlockModal block={selectedBlock} minStartTime={minStartTime} onClose={closeSaveBlockModal} />
      </DynamicModal>
      <DynamicModal open={openedCloneBlocksModal} onClose={closeCloneBlocksModal} width="600px" height="248px">
        <CloneBlocksModal onClose={closeCloneBlocksModal} />
      </DynamicModal>
    </>
  )
}

export default Block