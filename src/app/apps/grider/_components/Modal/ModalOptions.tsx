export type Props = {
  options: { title: string; value: string }[];
  onOptionSelected?: (value: string) => void;
};

export default function ModalOptions(props: Props) {
  return (
    <div className="Modal__content">
      {props.options.map((option) => (
        <button
          key={option.value}
          className="Modal__content__option"
          onClick={() => {
            props.onOptionSelected?.(option.value);
          }}
        >
          {option.title}
        </button>
      ))}
    </div>
  );
}
