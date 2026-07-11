import * as React from 'react';
import { useEffect, useRef } from 'react';

export type Props = {
  onSubmit: (e: string) => void;
  ph: string;
};

export default function ModalInput(props: Props) {
  const [url, setUrl] = React.useState('');
  const inputRef = useRef(null as HTMLInputElement | null);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
  };

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props.onSubmit(url);
  };

  useEffect(() => {
    const inputEl = inputRef?.current;
    inputEl?.focus?.();
  });

  return (
    <div className="Modal__content">
      <form className="Modal__content__form" onSubmit={handleOnSubmit}>
        <input
          ref={inputRef}
          className="Modal__content__form__input"
          type="text"
          onChange={handleOnChange}
          placeholder={props.ph}
          value={url}
        />
        <button className="Modal__content__form__submit" type="submit">
          Go
        </button>
      </form>
    </div>
  );
}
