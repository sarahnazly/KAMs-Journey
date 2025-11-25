import React from "react";
import ClientView from "./ClientView";

export default function OrientasiDetailPage({
  params,
}: {
  params: Promise<{ nik: string }>;
}) {
  const { nik } = React.use(params);
  return <ClientView nik={nik} />;
}