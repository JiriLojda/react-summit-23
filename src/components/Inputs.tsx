import { ChangeEventHandler } from "react";

type TextInputProps = Readonly<{
  value: string;
  onChange: (newValue: string) => void;
}>;

export const TextInput = (props: TextInputProps) => (
  <input
    className="bg-black border rounded p-1"
    value={props.value}
    onChange={e => props.onChange(e.target.value)}
  />
);

type DropdownProps<T> = Readonly<{
  value: T | null;
  onChange: (newOption: T) => void;
  options: ReadonlyArray<T>;
  getOptionId: (option: T) => string;
  getOptionName: (option: T) => string;
  noOptionText: string;
}>;

export const Dropdown = <T extends unknown>(props: DropdownProps<T>) => {
  const onChange: ChangeEventHandler<HTMLSelectElement> = e => {
    if (e.target.value === specialNoOptionId) {
      return;
    }
    const option = props.options.find(o => props.getOptionId(o) === e.target.value);

    if (option) {
      props.onChange(option);
    }
  };

  return (
    <select
      className="bg-black border rounded p-1 pr-2"
      onChange={onChange}
      value={props.value ? props.getOptionId(props.value) : undefined}
    >
      <option value={specialNoOptionId}>
        {props.noOptionText}
      </option>
      {props.options.map(o => (
        <option key={props.getOptionId(o)} value={props.getOptionId(o)}>
          {props.getOptionName(o)}
        </option>
      ))}
    </select>
  );
};

const specialNoOptionId = "92baec1a-2c50-43c4-a3e7-c0e6f13db759";
