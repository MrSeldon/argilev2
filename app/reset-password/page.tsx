import { ResetForm } from "@/components/auth/ResetForm";

export const metadata = { title: "New password | Le Four Argile" };

export default function ResetPasswordPage() {
  return (
    <div className="wrap-narrow !max-w-sm pt-12 md:pt-20 pb-24">
      <p className="eyebrow">Account</p>
      <h1 className="display text-[2.4rem] leading-tight mt-2 mb-6">Choose a new password</h1>
      <ResetForm />
    </div>
  );
}
