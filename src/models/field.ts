import { ReactElement } from "react";

export type UserDefinedField<Value> = Readonly<{
  renderField: (value: Value | null, updateValue: (newValue: Value) => void) => ReactElement;
}>;
