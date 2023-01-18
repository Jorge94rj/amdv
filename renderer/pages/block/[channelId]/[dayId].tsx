import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { DynamicModal } from "../../../components/Modal"
import SaveBlockModal from "../../../components/SaveBlockModal"
import { Button } from "../../../styles/form.style"
import { dayNames, IBlock } from "../../../types"
import { ActionHeader, BlockItem, BlockList, LeftContent, RightContent } from "../../../styled-components/block.style"

const Block = () => {
  const router = useRouter();
  const { channelId, dayId, dayName } = router.query;

  const [minStartTime, setMinStartTime] = useState('00:00');
  const [blocks, setBlocks] = useState<IBlock[]>([]);

  useEffect(() => {
    if (dayId) {
      getBlocks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayId])

  const getBlocks = async () => {
    // const req = await fetch(`/api/block/${channelId}/${dayId}`, {
    const req = await fetch(`/api/block/${dayId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      },
    });

    const res = await req.json();
    setBlocks([...res.blocks]);
    setMinStartTime(res.minStartTime)
  }

  const [openedSaveBlockModal, setOpenedSaveBlocklModal] = useState(false);
  const openSaveBlocklModal = () => {
    setOpenedSaveBlocklModal(true);
  }
  const closeSaveBlockModal = (saved?: boolean) => {
    if (saved) {
      getBlocks();
    }
    setOpenedSaveBlocklModal(false);
  }

  const resetBlocks = async () => {
    const req = await fetch(`/api/block/${dayId}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      },
    });

    const res = await req.json();
    getBlocks();
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
            </RightContent>
          </BlockItem>
        ))}
      </BlockList>
      <DynamicModal open={openedSaveBlockModal} onClose={closeSaveBlockModal} width="600px" height="460px">
        <SaveBlockModal minStartTime={minStartTime} onClose={closeSaveBlockModal} />
      </DynamicModal>
    </>
  )
}

export default Block