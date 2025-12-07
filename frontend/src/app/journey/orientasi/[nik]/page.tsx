import ClientView from "./ClientView";

export default async function OrientasiDetailPage({ params }: { params: { nik: string } }) {
  const { nik } = params; // tidak pakai React.use(), karena server

  return <ClientView nik={nik} />;
}
