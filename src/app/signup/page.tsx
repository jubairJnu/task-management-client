"use client";

import SignUpForm from "@/components/shared/SignUpForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContactRound } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { toast } from "sonner";

const SignUpPage = () => {
  const callbackUrl = "/dashboard";
  return (
    <div className="min-h-screen flex items-center justify-center  from-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
          <p className="text-gray-600">Sign Up to your account</p>
        </div>
        <Button
          variant="outline"
          onClick={() => toast("Event has been created")}
        >
          Default
        </Button>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center text-gray-800 flex justify-center">
              <ContactRound size={80} className="text-blue-500" />
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <SignUpForm callbackUrl={callbackUrl} />
            </Suspense>

            <div className="text-center mt-5">
              <p>
                Already have an account?
                <Link className="mx-2.5 text-blue-500" href="/login">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
