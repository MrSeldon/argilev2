import { MentorChat } from "@/components/mentor/MentorChat";

export const metadata = {
  title: "Mentor | Le Four Argile",
  description: "Get personalized ceramics guidance from an AI mentor",
};

export default function MentorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section - Shorter for chat context */}
      <section className="relative h-[30vh] w-full bg-gradient-to-br from-rose-800 via-stone-800 to-stone-900">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <h1 className="font-serif text-4xl md:text-5xl text-white tracking-tight mb-4">
            Ceramics Mentor
          </h1>
          <p className="text-sm text-white/60 max-w-lg">
            Ask questions about techniques, materials, glazes, firing, or anything else about your ceramics practice
          </p>
        </div>
      </section>

      {/* Chat Section */}
      <section className="flex-1 flex flex-col bg-cream">
        <MentorChat />
      </section>
    </div>
  );
}
