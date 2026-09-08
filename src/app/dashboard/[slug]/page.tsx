import { notFound } from "next/navigation";
import ServerComponentExample from "../_components/ServerComponentExample";
import ClientComponentExample from "../_components/ClientComponentExample";
import SuspenseExample from "../_components/(Suspense)/SuspenseExample";
import LoadingSpinner from "../_components/(Suspense)/SuspenseLoader";
import { Suspense } from "react";

interface DashBoardPageProps {
    params: Promise<{ slug: string }>;
}
const page = async ({ params }: DashBoardPageProps) => {
  const { slug } = await params;
  switch(slug) {
    case "server-component":
        return <ServerComponentExample />;
    case "client-component":
        return <ClientComponentExample />;
    case "suspense-example":
        return (
         <Suspense fallback={<LoadingSpinner />}>
           <SuspenseExample />
         </Suspense>
      );
    default:
        return notFound();
  }
}

export default page