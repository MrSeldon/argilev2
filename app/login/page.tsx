import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign in | Le Four Argile",
  description: "Sign in to keep your glaze shelf on your phone and laptop.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="wrap-narrow !max-w-sm pt-12 md:pt-20 pb-24">
      <div>
        <p className="eyebrow">Account</p>
        <h1 className="display text-[2.4rem] leading-tight mt-2 mb-3">Sign in</h1>
        <p className="text-body-md text-ink-2 mb-8">Your shelf, your sketches and your renders, the same on your phone and laptop.</p>
        <LoginForm next={next} />
      </div>
    </div>
  );
}
