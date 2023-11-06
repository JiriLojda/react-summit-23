"use client";

import { loadEntities, removeEntity, saveEntity } from "@/data/storage";
import { DocumentDuplicateIcon, DocumentPlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useState } from "react";
import { EventCreator } from "./EventCreator";

export const EventsListing = () => {
  const eventsByOrganizer = loadEntities("organizer").map(o => [o, loadEntities(`organizer/${o.id}/event`)] as const);
  const [, setChanged] = useState(0);
  const [sidebarProps, setSidebarProps] = useState<SidebarProps | null>(null);

  return (
    <div className="w-full flex gap-5">
      <div className="w-full flex flex-col gap-3">
        {eventsByOrganizer.map(([organizer, events]) => (
          <section key={organizer.id} className="w-full flex flex-col gap-3">
            <h2 className="flex gap-1">Events organized by <b>{organizer.name}</b> <div className="w-5 ml-3 text-green-600 cursor-pointer" onClick={() => setSidebarProps({ organizerId: organizer.id, eventId: null })}><DocumentPlusIcon /></div></h2>
            {events.map(event => (
              <div key={event.id} className="border rounded-lg p-2 flex justify-evenly">
                <div className="flex w-full">
                  <Link href={`/organizer/${organizer.id}/event/${event.id}`}>
                    {event.name}
                  </Link>
                </div>
                <div className="w-full flex justify-end">
                  <div
                    className="text-green-600 w-5 h-0 cursor-pointer"
                    onClick={() => setSidebarProps({ organizerId: organizer.id, eventId: event.id })}
                  >
                    <DocumentDuplicateIcon />
                  </div>
                  <div
                    className="text-red-600 w-5 h-0 cursor-pointer"
                    onClick={() => {
                      removeEntity(`organizer/${organizer.id}/event/${event.id}`);
                      setChanged(prev => prev + 1);
                    }}
                  >
                    <TrashIcon />
                  </div>
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
      {sidebarProps && (
        <div className="w-64 shrink-0 pt-10">
          <EventCreator
            onSave={(e, orgId) => {
              saveEntity(`organizer/${orgId}/event/${e.id}`, e);
              setChanged(prev => prev + 1);
              setSidebarProps(null);
            }}
            onClose={() => setSidebarProps(null)}
            variant={typeof sidebarProps.eventId === "string" ? "forEvent" : "forOrganizer"}
          />
        </div>
      )}
    </div>
  )
};

type SidebarProps = Readonly<{
  organizerId: string;
  eventId: string | null;
}>;
