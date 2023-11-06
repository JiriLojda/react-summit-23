"use client";
import { DataInitializer } from "@/app/DataInitializer";
import { EventCreator } from "@/app/EventCreator";
import { saveEntity } from "@/data/storage";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <DataInitializer>
      <div className="flex flex-col items-center min-h-screen pt-28">
        <EventCreator variant="standard" onSave={(event, organizerId) => {
          saveEntity(`organizer/${organizerId}/event/${event.id}`, event);

          router.push("/");
        }} />
      </div>
    </DataInitializer>
  )
}
