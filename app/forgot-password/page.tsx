import { ForgotForm } from "@/components/auth/ForgotForm";

export const metadata = { title: "Forgot password | Le Four Argile" };

export default function ForgotPasswordPage() {
  return (
    <div className="wrap-narrow !max-w-sm pt-12 md:pt-20 pb-24">
      <p className="eyebrow">Account</p>
      <h1 className="display text-[2.4rem] leading-tight mt-2 mb-3">Forgot your password?</h1>
      <p className="text-body-md text-ink-2 mb-8">Enter the email you sign in with and I’ll send a link to choose a new one.</p>
      <ForgotForm />
    </div>
  );
}
