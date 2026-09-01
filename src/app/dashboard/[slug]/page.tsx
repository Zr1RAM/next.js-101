import { notFound } from "next/navigation";

interface DashBoardPageProps {
    params: Promise<{ slug: string }>;
}
const page = async ({ params }: DashBoardPageProps) => {
  const { slug } = await params;
  switch(slug) {
    case "server-component":
        return <div>server-component</div>;
    case "client-component":
        return <div>client-component</div>;
    default:
        return notFound();
  }
}

export default page