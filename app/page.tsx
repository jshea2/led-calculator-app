import Image from "next/image";
import LEDCalculator from "@/components//ui/LEDCalculator";

export default function Home() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">LED Strip Calculator</h1>
      <LEDCalculator />
    </main>
  );
}
