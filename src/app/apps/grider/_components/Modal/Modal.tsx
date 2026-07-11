import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';
import ModalInput, { type Props as ModalInputProps } from './ModalInput';
import ModalOptions, { type Props as ModalOptionsProps } from './ModalOptions';

type Props = {
  onClose: () => void;
  inputModal?: ModalInputProps;
  optionsModal?: ModalOptionsProps;
};

export default function Modal(props: Props) {
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

  return createPortal(
    <div className="Modal" ref={modalRef}>
      {props.inputModal && <ModalInput {...props.inputModal} />}
      {props.optionsModal && <ModalOptions {...props.optionsModal} />}
    </div>,
    document.body,
  );
}
