import { DataInitializer } from "./DataInitializer";
import { EventsListing } from "./EventsListing";
import { LinkButton } from "@/components/Button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <DataInitializer>
        <div className="flex justify-end w-full">
          <LinkButton link="/event/create">Create event</LinkButton>
        </div>
        <EventsListing />
      </DataInitializer>
    </main>
  );
}
