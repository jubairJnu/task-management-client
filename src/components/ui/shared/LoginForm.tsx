"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Phone, Lock, Eye, EyeOff, ContactRound } from "lucide-react";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

interface LoginFormData {
  phone: string;
  password: string;
}

export const validatePhone = (phone: string) => {
  const phoneRegex = /^(?!(\+88))01[3-9]\d{8}$/;
  return phoneRegex.test(phone) || "Please enter a valid phone number";
};

export const validatePassword = (password: string) => {
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  return true;
};

const LoginForm = ({ callbackUrl }: { callbackUrl: string }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<LoginFormData>();

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        phone: data.phone,
        password: data.password,
        // redirect: false,
        callbackUrl,
      });

      if (res?.ok) {
        setIsLoading(false);
        toast.success("Login successful");
      }
    } catch (err) {
      const error = err as Error;
      setIsLoading(false);
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <div>
      <form
        onSubmit={loginForm.handleSubmit(onLoginSubmit)}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label
            htmlFor="login-phone"
            className="text-sm font-medium text-gray-700"
          >
            Phone Number
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="login-phone"
              type="tel"
              placeholder="Enter your phone number"
              className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              {...loginForm.register("phone", {
                required: "Phone number is required",
                validate: validatePhone,
              })}
            />
          </div>
          {loginForm.formState.errors.phone && (
            <p className="text-sm text-red-600">
              {loginForm.formState.errors.phone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="login-password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="pl-10 pr-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              {...loginForm.register("password", {
                required: "Password is required",
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {loginForm.formState.errors.password && (
            <p className="text-sm text-red-600">
              {loginForm.formState.errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
          disabled={loginForm.formState.isSubmitting || isLoading}
        >
          {loginForm.formState.isSubmitting || isLoading
            ? "Signing in..."
            : "Sign In"}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
