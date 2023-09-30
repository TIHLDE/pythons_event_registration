'use client';

import { Button, ButtonProps } from '@nextui-org/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { useDisclosure } from '@nextui-org/use-disclosure';

export type EventModalProps = {
  title: string;
  description?: string;
  onConfirm: () => void;
} & ButtonProps;

const ConfirmModal = ({ title, description = 'Er du helt sikker?', onConfirm, children, ...props }: EventModalProps) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  return (
    <>
      <Button color='danger' variant='light' {...props} onClick={onOpen}>
        {children}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody className='flex flex-col gap-4'>
            <p className='text-md'>{description}</p>
          </ModalBody>
          <ModalFooter>
            <Button color='danger' onPress={onClose} variant='flat'>
              Nei, avbryt
            </Button>
            <Button
              color='primary'
              onClick={() => {
                onConfirm();
                onClose();
              }}
              variant='solid'>
              Jeg er sikker
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmModal;
