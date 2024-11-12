import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <SignIn 
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        redirectUrl="/dashboard"
        afterSignInUrl="/dashboard"
      />
    </div>
  );
} 