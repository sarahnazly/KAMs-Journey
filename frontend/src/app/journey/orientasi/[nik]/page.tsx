import ClientView from "./ClientView";

export default async function OrientasiDetailPage({ params }: { params: Promise<{ nik: string }> }) {
  const { nik } = await params; // await the params promise

  return <ClientView nik={nik} />;
}
