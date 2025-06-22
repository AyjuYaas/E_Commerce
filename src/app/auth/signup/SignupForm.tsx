"use client";

import { registerUser } from "@/actions/auth.action";
import CustomDatePicker from "@/components/CustomDatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignUpFormType } from "@/types/auth.types";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const SignupForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormType>({
    name: "",
    email: "",
    password: "",
    dob: undefined,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(() => ({ ...formData, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await registerUser(formData);
      if (res.success) {
        toast.success("Successfully Registered");
        router.push("/auth/login");
      } else {
        toast.error(res.error || "Something went wrong");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
    console.log(formData);
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {/* Name Field */}
      <div>
        <label htmlFor="name">Name</label>
        <Input
          name="name"
          placeholder="Enter your Name"
          value={formData.name}
          onChange={handleFormData}
          required
        />
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email">Email</label>
        <Input
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleFormData}
          required
        />
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password">Password</label>
        <Input
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleFormData}
          required
        />
      </div>

      {/* Date of Birth Field */}
      <div className="flex flex-col">
        <label htmlFor="dob">Date of Birth</label>
        <CustomDatePicker
          value={formData.dob}
          onDateChange={(date) =>
            setFormData((prev) => ({ ...prev, dob: date }))
          }
          disableFuture={true}
        />
      </div>

      {/* submit button */}
      <div className="mt-5">
        {isLoading ? (
          <Button disabled className="w-full">
            <Loader2Icon className="animate-spin" />
            Signing In
          </Button>
        ) : (
          <Button variant={"default"} type="submit" className="w-full">
            Sign In
          </Button>
        )}
      </div>
    </form>
  );
};
export default SignupForm;
