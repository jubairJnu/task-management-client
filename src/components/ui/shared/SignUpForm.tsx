"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Phone, Lock, Eye, EyeOff, ContactRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { validatePassword, validatePhone } from "./LoginForm";
interface SignupFormData {
  phone: string;
  password: string;
  confirmPassword: string;
}

const SignUpForm = ({ callbackUrl }: { callbackUrl: string }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const signupForm = useForm<SignupFormData>();

  const onSignupSubmit = async (data: SignupFormData) => {
    if (data.password !== data.confirmPassword) {
      signupForm.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
    console.log("Signup data:", data);
    // Handle signup logic here
  };

  return (
    <div>
      <form
        onSubmit={signupForm.handleSubmit(onSignupSubmit)}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label
            htmlFor="signup-phone"
            className="text-sm font-medium text-gray-700"
          >
            Phone Number
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="signup-phone"
              type="tel"
              placeholder="Enter your phone number"
              className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              {...signupForm.register("phone", {
                required: "Phone number is required",
                validate: validatePhone,
              })}
            />
          </div>
          {signupForm.formState.errors.phone && (
            <p className="text-sm text-red-600">
              {signupForm.formState.errors.phone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="signup-password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              className="pl-10 pr-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              {...signupForm.register("password", {
                required: "Password is required",
                validate: validatePassword,
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
          {signupForm.formState.errors.password && (
            <p className="text-sm text-red-600">
              {signupForm.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="signup-confirm-password"
            className="text-sm font-medium text-gray-700"
          >
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="signup-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              className="pl-10 pr-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              {...signupForm.register("confirmPassword", {
                required: "Please confirm your password",
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {signupForm.formState.errors.confirmPassword && (
            <p className="text-sm text-red-600">
              {signupForm.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
          disabled={signupForm.formState.isSubmitting}
        >
          {signupForm.formState.isSubmitting
            ? "Creating account..."
            : "Create Account"}
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm;
