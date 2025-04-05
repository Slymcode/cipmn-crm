import React, { useRef } from "react";
import { Form, Input, Button } from "antd";
import { useLogin, useNotification } from "@refinedev/core";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDocumentTitle } from "@refinedev/react-router";

interface LoginForm {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const { mutate: login } = useLogin();
  const location = useLocation();
  const { open } = useNotification();
  const hasShownLogoutToast = useRef(false);
  useDocumentTitle("Login | CIPMN CRM");

  const onFinish = (values: LoginForm) => {
    login(values);
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get("logged_out") === "true" && !hasShownLogoutToast.current) {
      open?.({
        type: "success",
        message: "",
        description: "You have been successfully logged out.",
      });
      hasShownLogoutToast.current = true;
    }
  }, [location.search, open]);

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-[#1F5E29] mb-4">
          Welcome!
        </h2>
        <p className="text-sm font-medium text-gray-600">
          Enter your login credentials to access your profile.
        </p>
      </div>

      {/* Login Form */}
      <Form layout="vertical" onFinish={onFinish} className="w-full mt-6">
        {/* Email Field */}
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Enter your email" }]}
          className="mb-6"
        >
          <Input
            placeholder="Email"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#1F5E29] focus:border-[#1F5E29] transition-all"
            onFocus={(e) => (e.target.style.borderColor = "#1F5E29")}
          />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Enter your password" }]}
          className="mb-6"
        >
          <Input.Password
            placeholder="Password"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#1F5E29] focus:border-[#1F5E29] transition-all"
            onFocus={(e) => (e.target.style.borderColor = "#1F5E29")}
          />
        </Form.Item>

        {/* Forgot Password */}
        <div className="text-xs font-medium text-right text-[#1F5E29] mb-6 cursor-pointer hover:underline">
          <Link
            to="/forgot-password"
            className="text-[#1F5E29] font-semibold hover:underline"
            style={{ color: "#1F5E29" }}
          >
            Forgot password?
          </Link>
        </div>

        {/* Sign In Button */}
        <Button
          type="primary"
          htmlType="submit"
          className="w-full p-3 text-white font-semibold bg-[#1F5E29] rounded-md transition-all duration-300 hover:bg-[#174a21] hover:shadow-lg"
          style={{ background: "#1F5E29", border: "none" }}
        >
          Sign in
        </Button>
      </Form>

      {/* Sign Up Link */}
      <div className="mt-6 text-sm">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-[#1F5E29] font-semibold hover:underline"
          style={{ color: "#1F5E29" }}
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};
