import { makeReadonly } from "@/utils/typeguards";
import * as tg from "generic-type-guard";

export type Organizer = tg.GuardedType<typeof isOrganizer>;

export const isOrganizer = makeReadonly(new tg.IsInterface()
  .withProperties({
    id: tg.isString,
    name: tg.isString,
  })
  .get());
