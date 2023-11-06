"use client";
import { loadEntity } from "@/data/storage";

export default function Page(props: Readonly<{ params: Readonly<{ eventId: string; organizerId: string }>; }>) {
  const event = loadEntity(`organiser/${props.params.organizerId}/event/${props.params.eventId}`);
  if (!event) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>This event does not exist.</h1>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full flex flex-col gap-3">
        <h1>{event.name}</h1>
        <div>{event.description}</div>
      </div>
    </main>
  )
}
