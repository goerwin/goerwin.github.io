import { useEffect, useRef } from 'react';
import usePortal from 'react-useportal';
import './Modal.css';
import ModalInput, { type Props as ModalInputProps } from './ModalInput';
import ModalOptions, { type Props as ModalOptionsProps } from './ModalOptions';

type Props = {
  onClose: () => void;
  inputModal?: ModalInputProps;
  optionsModal?: ModalOptionsProps;
};

export default function Modal(props: Props) {
  const { Portal } = usePortal();
  const modalRef = useRef(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef && modalRef.current === e.target) {
      props.onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <Portal>
      <div className="Modal" ref={modalRef}>
        {props.inputModal && <ModalInput {...props.inputModal} />}
        {props.optionsModal && <ModalOptions {...props.optionsModal} />}
      </div>
    </Portal>
  );
}
