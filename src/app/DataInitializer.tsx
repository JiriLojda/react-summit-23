"use client";
import { ReactNode, useEffect, useState } from "react";
import { saveEntity } from "@/data/storage";
import { Atendee } from "@/models/atendee";
import { Organizer } from "@/models/organizer";
import { Event } from "@/models/event";

export const DataInitializer = (props: Readonly<{ children: ReactNode }>) => {
  const [areDataInitialized, setAreDataInitialized] = useState(false);

  useEffect(() => {
    if (areDataInitialized) {
      return;
    }
    setAreDataInitialized(true);
    if (localStorage.getItem(hasInitialDataFlagName) === "true") {
      return;
    }
    initialOrganizers.forEach(o => saveEntity(`organizer/${o.id}`, o));

    Object.entries(initialEventsByOrganizerId)
      .forEach(([orgId, events]) => events.forEach(e => saveEntity(`organizer/${orgId}/event/${e.id}`, e)));

    initialAtendees.forEach(a => saveEntity(`atendee/${a.id}`, a));

    localStorage.setItem(hasInitialDataFlagName, "true");
  }, [areDataInitialized]);

  if (!areDataInitialized) {
    return <h1>Initializing data...</h1>;
  }

  return props.children;
};

const hasInitialDataFlagName = "hasInitialData";


const organizer1Id = "7ff728e1-4606-438d-9217-c1579ca16bfa";
const organizer2Id = "9e5ac87d-c320-45e9-8693-947643396629";

export const initialEventsByOrganizerId: Readonly<Record<string, ReadonlyArray<Event>>> = {
  [organizer1Id]: [
    {
      id: "c98d5963-2938-4cb6-950f-787b0121730c",
      name: "House of Metal",
      location: { city: "Umea", street: "Skolgatan" },
      description: "House of Metal is a two day indoor festival dedicated to various kinds of metal. The festival premiered at Umeå Folkets Hus in February 2007. HoM has three stages and every year 20-25 bands, Swedish and international, crowd these stages.",
      date: { from: new Date(2023, 10, 10).toString(), to: new Date(2023, 10, 11).toString() },
      createdAt: new Date(2023, 10, 3).toString(),
    },
    {
      id: "39ca6030-1802-4009-8137-f9387a9dd4c7",
      name: "Toxicator",
      location: { latitude: 49.469172, longitude: 8.522929 },
      description: "This single day German festival in December is strictly hardstyle. Like a virus, Toxicator 'terrifies the simple minds and only infects the strongest souls.' Get after it.",
      date: new Date(2023, 11, 2).toString(),
      createdAt: new Date(2023, 10, 3).toString(),
    },
  ],
  [organizer2Id]: [
    {
      id: "71d9571f-b162-4f89-9639-99611722ea75",
      name: "Snowattack",
      location: { latitude: 45.010488, longitude: 6.124617 },
      description: "From the country that invented apres-ski parties comes Snowattack, an annual mid-winter ode to electronic music and ski culture. The week long festival takes place at the Les Orres ski area in France with over 100 kilometers of slopes and 19 lifts to keep you entertained between a packed lineup of DJs.",
      date: { from: new Date(2024, 0, 20).toString(), to: new Date(2024, 0, 27).toString() },
      createdAt: new Date(2023, 10, 3).toString(),
    },
    {
      id: "383584cb-1fa9-4380-9bb0-930a29ce2688",
      name: "Bearded Theory Festival",
      location: { latitude: 52.733173, longitude: -1.693354 },
      description: "The multi-award winning and family-friendly festival, Bearded Theory, comes together for their Spring Gathering during the May bank holiday weekend. Besides the eclectic music lineup and children's activities, the festival also hosts a World Record Attempt for the Largest Number of People Wearing False Beards.",
      date: { from: new Date(2024, 4, 23).toString(), to: new Date(2024, 4, 26).toString() },
      createdAt: new Date(2023, 10, 3).toString(),
    },
  ],
};

export const initialOrganizers: ReadonlyArray<Organizer> = [
  {
    id: organizer1Id,
    name: "John Doe",
  },
  {
    id: organizer2Id,
    name: "Harry Poter",
  },
];

export const initialAtendees: ReadonlyArray<Atendee> = [
  {
    id: "fae8d8fa-f746-4c50-9d74-f51aaf209ab0",
    name: "John Doe",
    age: 34,
  },
  {
    id: "5703b0f0-dce6-4e52-b3bc-615304bbe198",
    name: "John Wick",
    age: 43,
  },
  {
    id: "dd71b275-5d78-4bcf-81eb-01007f8e444d",
    name: "Legolas",
    age: 99,
  },
];

