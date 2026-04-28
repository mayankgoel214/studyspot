import { Suspense } from "react";
import { SignInForm } from "./form";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  return (
    <Suspense>
      <SignInForm next={sp.next} />
    </Suspense>
  );
}
