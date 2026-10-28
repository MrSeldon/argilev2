import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign in | Le Four Argile",
  description: "Sign in to keep your glaze shelf on your phone and laptop.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="min-h-screen pb-16">
      {/* dark band behind the fixed white nav (this page has no hero) */}
      <div className="h-14 md:h-[88px] bg-charcoal-dark" aria-hidden />
      <div className="max-w-sm mx-auto px-4 pt-10">
        <h1 className="font-serif text-display-sm md:text-display-md mb-2">Sign in</h1>
        <p className="text-body-sm text-warm-500 mb-8">Your glaze shelf, saved and the same on your phone and laptop.</p>
        <LoginForm next={next} />
      </div>
    </div>
  );
}
