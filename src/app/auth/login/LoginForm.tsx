"use client";

import useAuthStore from "@/app/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginFormType } from "@/types/auth.types";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormType>({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { userLogin } = useAuthStore();

  const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(() => ({ ...formData, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await userLogin(formData);

    if (res) {
      router.push("/");
    }

    setIsLoading(false);
  };

  return (
    <form className="flex flex-col gap-5 text-lg" onSubmit={handleSubmit}>
      {/* Email Field */}
      <div>
        <label htmlFor="name">Email</label>
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

      {/* submit button */}
      <div className="mt-5">
        {isLoading ? (
          <Button disabled className="w-full">
            <Loader2Icon className="animate-spin" />
            Logging in
          </Button>
        ) : (
          <Button variant={"default"} type="submit" className="w-full">
            Login
          </Button>
        )}
      </div>
    </form>
  );
};
export default LoginForm;
