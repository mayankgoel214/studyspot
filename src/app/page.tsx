import { redirect } from "next/navigation";

/**
 * Everyone lands on the map.
 *
 * This used to send signed-out visitors to /sign-in, which meant the only thing
 * a stranger could see of StudySpot was a form asking for their email. The map,
 * the spots and the live occupancy are public; sign-in is now something you are
 * offered when you try to save or book, not a toll gate at the front door.
 */
export default async function Home() {
  redirect("/app");
}
