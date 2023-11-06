import { makeReadonly } from "@/utils/typeguards";
import * as tg from "generic-type-guard";

export type Atendee = tg.GuardedType<typeof isAtendee>;

export const isAtendee = makeReadonly(new tg.IsInterface()
  .withProperties({
    id: tg.isString,
    name: tg.isString,
    age: tg.isNumber,
  })
  .get());
