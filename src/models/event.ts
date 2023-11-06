import { makeReadonly } from "@/utils/typeguards";
import * as tg from "generic-type-guard";

export type Event = tg.GuardedType<typeof isEvent>;

const isAddress = makeReadonly(new tg.IsInterface()
  .withProperties({
    street: tg.isString,
    city: tg.isString,
  })
  .get());

const isCoordinates = makeReadonly(new tg.IsInterface()
  .withProperties({
    latitude: tg.isNumber,
    longitude: tg.isNumber,
  })
  .get());

const isRange = makeReadonly(new tg.IsInterface()
  .withProperties({
    from: tg.isString,
    to: tg.isString,
  })
  .get());

export const isEvent = makeReadonly(new tg.IsInterface()
  .withProperties({
    id: tg.isString,
    name: tg.isString,
    description: tg.isString,
    location: tg.isUnion(isAddress, isCoordinates),
    date: tg.isUnion(tg.isString, isRange),
    createdAt: tg.isString,
  })
  .get());
