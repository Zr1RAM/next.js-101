import { notFound } from "next/navigation";
import ServerComponentExample from "../_components/ServerComponentExample";
import ClientComponentExample from "../_components/ClientComponentExample";
import SuspenseExample from "../_components/(Suspense)/SuspenseExample";
import LoadingSpinner from "../_components/(Suspense)/SuspenseLoader";
import { Suspense } from "react";
import SSGExample from "../_components/(SSGExample)/SSGExample";

interface DashBoardPageProps {
    params: Promise<{ slug: string }>;
}

export const dynamicParams = true; // if you set to false, any routes that are not mentioned in generateStaticParams won't be generated and will return 404

export async function generateStaticParams() {
  return [
    { slug: "static-example-1" },
    { slug: "static-example-2" },
    { slug: "static-example-3" },
    { slug: "static-example-4" },
  ];
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
    case "static-example-1":
    case "static-example-2":
    case "static-example-3":
    case "static-example-4":
      return <SSGExample slug={slug} />;
    default:
        return notFound();
  }
}

export default page