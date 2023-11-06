import * as tg from "generic-type-guard";

export const makeReadonly = <Input, Output extends Input>(guard: tg.PartialTypeGuard<Input, Output>): tg.PartialTypeGuard<Input, Readonly<Output>> => guard;
