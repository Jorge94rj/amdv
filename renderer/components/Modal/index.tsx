import React, { ReactNode } from 'react';
import ReactModal from 'react-modal';
import Icon from '../Icon';
import { Actions, ModalContainer, IconAction } from './style';
import dynamic from 'next/dynamic';

interface IModal {
  open: boolean;
  children: ReactNode;
  onClose: (resolved?: boolean) => void;
  width: string;
  height: string;
}

if (ReactModal.defaultStyles.overlay) {
  ReactModal.defaultStyles.overlay.backgroundColor = 'rgba(0, 0, 0, 0.7)';
}

const Modal = ({
  open,
  children,
  onClose,
  width,
  height
}: IModal) => {

  const customStyles = {
    content: {
      width: width || '70%',
      height: height || '60%',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
  }

  const handleEscClose = ({ key }: { key: string }) => {
    if (key === 'Escape') {
      onClose();
    }
  }

  const handleClose = () => {
    onClose();
  }

  return (
    <div onKeyUp={handleEscClose}>
      <ReactModal
        appElement={document.body}
        isOpen={open}
        style={customStyles}
        onRequestClose={handleClose}
      >
        <ModalContainer>
          <Actions>
            <IconAction onClick={handleClose}>
              <Icon name="close" color="#0099cc" />
            </IconAction>
          </Actions>
          {children}
        </ModalContainer>
      </ReactModal>
    </div>
  )
}

export default Modal

export const DynamicModal = dynamic(
  () => import('../../components/Modal'),
  { ssr: false }
)