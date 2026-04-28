import { notFound } from "next/navigation";
import { getSpotComputed } from "@/lib/queries";
import { BookingFlow } from "../../../_components/BookingFlow";

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getSpotComputed(id);
  if (!data) notFound();
  return <BookingFlow spot={data.spot} rooms={data.rooms} />;
}
