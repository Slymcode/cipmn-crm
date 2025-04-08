import React from "react";
import { Form, Input, Button } from "antd";
import { useRegister, useNotification } from "@refinedev/core";

import { Link } from "react-router-dom";
import { useDocumentTitle } from "@refinedev/react-router";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Register: React.FC = () => {
  const { mutate: register } = useRegister();
  useDocumentTitle("Register | CIPMN CRM");
  const { open: notify } = useNotification();
  const onFinish = async (values: RegisterForm) => {
    register(values);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-[#1F5E29] mb-4">
          Register!
        </h2>
        <p className="text-sm font-medium text-gray-600">
          Create your login credentials to access your profile.
        </p>
      </div>

      {/* Login Form */}
      <Form layout="vertical" onFinish={onFinish} className="w-full mt-6">
        {/* Name Field */}
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Enter your full name" }]}
          className="mb-6"
        >
          <Input
            placeholder="Full name"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#1F5E29] focus:border-[#1F5E29] transition-all"
            onFocus={(e) => (e.target.style.borderColor = "#1F5E29")}
          />
        </Form.Item>
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
        {/* Confirm Password Field */}
        <Form.Item
          name="confirmPassword"
          rules={[{ required: true, message: "Confirm your password" }]}
          className="mb-6"
        >
          <Input.Password
            placeholder="Confirm Password"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#1F5E29] focus:border-[#1F5E29] transition-all"
            onFocus={(e) => (e.target.style.borderColor = "#1F5E29")}
          />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full p-3 text-white font-semibold bg-[#1F5E29] rounded-md transition-all duration-300 hover:bg-[#174a21] hover:shadow-lg"
          style={{ background: "#1F5E29", border: "none" }}
        >
          Create account
        </Button>
      </Form>

      {/* Sign Up Link */}
      <div className="mt-6 text-sm">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-[#1F5E29] font-semibold hover:underline"
          style={{ color: "#1F5E29" }}
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};
