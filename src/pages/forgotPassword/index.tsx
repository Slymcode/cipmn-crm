import React from "react";
import { Form, Input, Button } from "antd";
import { useLogin } from "@refinedev/core";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "@refinedev/react-router";

export const ForgotPassword: React.FC = () => {
  const onFinish = (values: { email: string }) => {};
  useDocumentTitle("Forgot Password | CIPMN CRM");

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-xl font-extrabold text-[#1F5E29] mb-4">
          Forgot your password?
        </h2>
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

        {/* Forgot Password */}
        <div className="text-xs font-normal text-right mb-6">
          Have an account?{" "}
          <Link
            to="/login"
            className="text-[#1F5E29] font-semibold hover:underline"
            style={{ color: "#1F5E29" }}
          >
            Sign in
          </Link>
        </div>

        {/* Sign In Button */}
        <Button
          type="primary"
          htmlType="submit"
          className="w-full p-3 text-white font-semibold bg-[#1F5E29] rounded-md transition-all duration-300 hover:bg-[#174a21] hover:shadow-lg"
          style={{ background: "#1F5E29", border: "none" }}
        >
          Send reset instructions
        </Button>
      </Form>
    </div>
  );
};
