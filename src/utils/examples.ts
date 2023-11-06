import { Event } from "@/models/event";
import { v4 as createUuid } from "uuid";

export const createSampleEvent = (eventType: string): Event => {
  switch (eventType) {
    case "musicFestival":
      return {
        id: createUuid(),
        name: "Sample music festival",
        description: "Sample music festival description",
        date: new Date().toString(),
        location: {
          city: "Sample city",
          street: "Sample street"
        },
        createdAt: new Date().toString(),
      };
    case "techConference":
      return {
        id: createUuid(),
        name: "Sample tech conference",
        description: "Sample tech conference description",
        date: new Date().toString(),
        location: {
          city: "Sample city",
          street: "Sample street"
        },
        createdAt: new Date().toString(),
      };
    default:
      throw new Error(`Unknown event type '${eventType}'`);
  }
};

createSampleEvent("technicalConference");

export const findByReference = (reference: Readonly<{ id?: string; externalId?: string }>) => reference; // imagine any working implementation here
