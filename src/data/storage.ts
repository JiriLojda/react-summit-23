import { isAtendee } from "@/models/atendee";
import { isEvent } from "@/models/event";
import { isOrganizer } from "@/models/organizer";
import * as tg from "generic-type-guard";

export const saveEntity = <Key extends string>(key: Key, entity: KeyToEntity<Key, true>) => {
  const allKey = entityKeyToAllEntitiesKey(key);
  const existingRawEntities = localStorage.getItem(allKey) ?? "[]";
  const existingEntities = JSON.parse(existingRawEntities) ?? [];

  if (!Array.isArray(existingEntities)) {
    localStorage.setItem(allKey, JSON.stringify([entity]));
  }

  return localStorage.setItem(allKey, JSON.stringify([...existingEntities, entity]));
};

export const loadEntity = <Key extends string>(key: Key): KeyToEntity<Key, true> | null => {
  const allKey = entityKeyToAllEntitiesKey(key);
  const rawData = localStorage.getItem(allKey);
  const parsedData = JSON.parse(rawData || "[]");
  const guard = findGuardForKey<Key, true>(key);
  const entityId = getEntityId(key);

  if (!tg.isArray(guard)(parsedData)) {
    localStorage.setItem(allKey, "[]");
    return null;
  }

  return parsedData.find(e => e.id === entityId) || null;
};

export const loadEntities = <Key extends string>(key: Key): ReadonlyArray<KeyToEntity<Key, false>> => {
  const rawData = localStorage.getItem(key);
  const parsedData = JSON.parse(rawData || "[]");
  const guard = findGuardForKey<Key, false>(key);

  if (!tg.isArray(guard)(parsedData)) {
    localStorage.setItem(key, "[]");
    return [];
  }

  return parsedData;
};

export const removeEntity = <Key extends string>(key: Key): KeyToEntity<Key, true> extends KeyNotFoundType ? Promise<KeyNotFoundType> : undefined => {
  const allKey = entityKeyToAllEntitiesKey(key);
  const rawData = localStorage.getItem(allKey);
  const parsedData = JSON.parse(rawData || "[]");
  const guard = findGuardForKey<Key, true>(key);

  if (!tg.isArray(guard)(parsedData)) {
    localStorage.setItem(allKey, "[]");
    return undefined as KeyToEntity<Key, true> extends KeyNotFoundType ? Promise<KeyNotFoundType> : undefined;
  }

  localStorage.setItem(allKey, JSON.stringify(parsedData.filter(e => e.id !== getEntityId(key))));

  return undefined as KeyToEntity<Key, true> extends KeyNotFoundType ? Promise<KeyNotFoundType> : undefined;
}

const findGuardForKey = <Key extends string, ShouldIncludeId extends boolean>(key: Key): tg.TypeGuard<KeyToEntity<Key, ShouldIncludeId>> => {
  const parts = key.split("/").filter((_, i) => i % 2 == 0);

  const shape = parts.reduce(
    (shapes, part) => shapes.subEntities?.[part] ?? {},
    { subEntities: savedEntitiesGuards } as Partial<EntityGuardsShape[string]>,
  );

  const result = shape?.guard ?? null;
  if (!result) {
    throw new Error(`Failed to find a guard for key ${key}`);
  }

  return result as tg.TypeGuard<KeyToEntity<Key, ShouldIncludeId>>;
};

type KeyToEntity<Key extends string, ShouldIncludeId extends boolean> = KeyToEntityRec<Key, typeof savedEntitiesGuards, ShouldIncludeId>;

type KeyToEntityRec<Key extends string, Shapes extends EntityGuardsShape, ShouldIncludeId extends boolean> = Key extends `${infer TopLevelKey extends string & keyof Shapes}/${string}/${infer Rest extends string}`
  ? KeyToEntityRec<Rest, Shapes[TopLevelKey]["subEntities"], ShouldIncludeId>
  : Key extends `${infer TopLevelKey extends string & keyof Shapes}${ShouldIncludeId extends true ? `/${string}` : ""}`
  ? tg.GuardedType<Shapes[TopLevelKey]["guard"]>
  : KeyNotFoundType;

type KeyNotFoundType = "The provided key is not valid." & { id: string };

const savedEntitiesGuards = {
  organizer: {
    guard: isOrganizer,
    subEntities: {
      event: {
        guard: isEvent,
        subEntities: {},
      },
    },
  },
  atendee: {
    guard: isAtendee,
    subEntities: {},
  },
} as const satisfies EntityGuardsShape;

type EntityGuardsShape = Readonly<Record<string, Readonly<{ guard: tg.TypeGuard<Readonly<{ id: string }>>; subEntities: EntityGuardsShape }>>>;

const entityKeyToAllEntitiesKey = (key: string) =>
  key.split("/").slice(0, -1).join("/");

const getEntityId = (key: string) =>
  key.split("/").findLast(() => true);
