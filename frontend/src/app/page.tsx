import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* konten utama */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-[#02214C] mb-4">
          Welcome to KAMs Journey
        </h1>
        <p className="text-gray-600">
          Upload your data and start analyzing with our machine learning
          features.
        </p>
      </main>
    </div>
  );
}
