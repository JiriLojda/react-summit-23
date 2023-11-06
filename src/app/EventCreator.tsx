"use client";
import { Button } from "@/components/Button";
import { Dropdown, TextInput } from "@/components/Inputs";
import { loadEntities, loadEntity } from "@/data/storage";
import { Event } from "@/models/event";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { v4 as createUuid } from "uuid";

type Props = Readonly<{
  onSave: (event: Event, organizerId: string) => void;
  onClose?: () => void;
}> & PerVariantProps;

export const EventCreator = (props: Props) => {
  const sourceEvent = props.variant === "fromEvent" ? loadEntity(`organizer/${props.organizerId}/event/${props.sourceEventId}`) : null;
  const [event, setEvent] = useState(withSpecificProps(sourceEvent ?? emptyEvent));
  const [organizerId, setOrganizerId] = useState(props.variant === "standard" ? null : props.organizerId);
  const organizers = loadEntities("organizer");

  return (
    <form
      className="flex flex-col items-stretch gap-5 border rounded-2xl p-7"
      onSubmit={e => {
        e.preventDefault();
        return organizerId && props.onSave(event, organizerId);
      }}
    >
      {props.onClose && (
        <div className="w-full flex justify-end pb-6">
          <div className="w-5 h-0 cursor-pointer" onClick={props.onClose}>
            <XMarkIcon />
          </div>
        </div>
      )}
      {props.variant === "fromEvent" && !sourceEvent && (
        <div>
          The event does not exist.
        </div>
      )}
      <TextInput value={event.name} onChange={name => setEvent(prev => ({ ...prev, name }))} />
      {props.variant === "standard" && (
        <Dropdown
          value={organizers.find(o => o.id === organizerId) ?? null}
          onChange={o => setOrganizerId(o.id)}
          options={organizers}
          getOptionId={o => o.id}
          getOptionName={o => o.name}
          noOptionText="Select an organizer"
        />
      )}
      <Button type="submit" disabled={!organizerId || !event.name}>Create</Button>
    </form>
  )
};

type PerVariantProps = keyof PropsPerVariant extends infer Variant extends keyof PropsPerVariant
  ? Variant extends any ? Readonly<{ variant: Variant; }> & PropsPerVariant[Variant] : never
  : never;

type PropsPerVariant = {
  standard: Readonly<{}>,
  forOrganizer: Readonly<{ organizerId: string }>;
  fromEvent: Readonly<{ organizerId: string; sourceEventId: string }>;
};

const emptyEvent: Event = {
  id: "",
  name: "",
  description: "",
  date: new Date().toString(),
  location: { street: "", city: "" },
  createdAt: new Date().toString(),
};

const withSpecificProps = (event: Event): Event => ({
  ...event,
  id: createUuid(),
  createdAt: new Date().toString(),
});
