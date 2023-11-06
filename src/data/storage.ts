import { isAtendee } from "@/models/atendee";
import { isEvent } from "@/models/event";
import { isOrganizer } from "@/models/organizer";
import * as tg from "generic-type-guard";

export const saveEntity = (key: string, entity: any) => {
  const allKey = entityKeyToAllEntitiesKey(key);
  const existingRawEntities = localStorage.getItem(allKey) ?? "[]";
  const existingEntities = JSON.parse(existingRawEntities) ?? [];

  if (!Array.isArray(existingEntities)) {
    localStorage.setItem(allKey, JSON.stringify([entity]));
  }

  return localStorage.setItem(allKey, JSON.stringify([...existingEntities, entity]));
};

export const loadEntity = (key: string): any | null => {
  const allKey = entityKeyToAllEntitiesKey(key);
  const rawData = localStorage.getItem(allKey);
  const parsedData = JSON.parse(rawData || "[]");
  const guard = findGuardForKey(key);
  const entityId = getEntityId(key);

  if (!tg.isArray(guard)(parsedData)) {
    localStorage.setItem(allKey, "[]");
    return null;
  }

  return parsedData.find(e => e.id === entityId) || null;
};

export const loadEntities = (key: string): ReadonlyArray<any> => {
  const rawData = localStorage.getItem(key);
  const parsedData = JSON.parse(rawData || "[]");
  const guard = findGuardForKey(key);

  if (!tg.isArray(guard)(parsedData)) {
    localStorage.setItem(key, "[]");
    return [];
  }

  return parsedData;
};

export const removeEntity = (key: string): void => {
  const allKey = entityKeyToAllEntitiesKey(key);
  const rawData = localStorage.getItem(allKey);
  const parsedData = JSON.parse(rawData || "[]");
  const guard = findGuardForKey(key);

  if (!tg.isArray(guard)(parsedData)) {
    localStorage.setItem(allKey, "[]");
    return;
  }

  localStorage.setItem(allKey, JSON.stringify(parsedData.filter(e => e.id !== getEntityId(key))));
}

const findGuardForKey = (key: string): tg.TypeGuard<any> => {
  const parts = key.split("/").filter((_, i) => i % 2 == 0);

  const shape = parts.reduce(
    (shapes, part) => shapes.subEntities?.[part] ?? {},
    { subEntities: savedEntitiesGuards } as any,
  );

  const result = shape?.guard ?? null;
  if (!result) {
    throw new Error(`Failed to find a guard for key ${key}`);
  }

  return result as tg.TypeGuard<any>;
};

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
};

const entityKeyToAllEntitiesKey = (key: string) =>
  key.split("/").slice(0, -1).join("/");

const getEntityId = (key: string) =>
  key.split("/").findLast(() => true);
