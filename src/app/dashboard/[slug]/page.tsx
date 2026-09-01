import { notFound } from "next/navigation";
import ServerComponentExample from "../_components/ServerComponentExample";
import ClientComponentExample from "../_components/ClientComponentExample";

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
    default:
        return notFound();
  }
}

export default page