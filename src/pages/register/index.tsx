import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { useRegister, useNotification } from "@refinedev/core";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "@refinedev/react-router";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: string;
}

export const Register: React.FC = () => {
  const { mutate: register } = useRegister();
  const { open: notify } = useNotification();
  const [loading, setLoading] = useState(false);
  useDocumentTitle("Register | CIPMN CRM");

  const onFinish = async (values: RegisterForm) => {
    setLoading(true);
    const finalValues: RegisterForm = {
      ...values,
      userType: "staff",
    };

    register(finalValues, {
      onSuccess: () => setLoading(false),
      onError: () => setLoading(false),
    });
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

      <Form layout="vertical" onFinish={onFinish} className="w-full mt-6">
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Enter your full name" }]}
          className="mb-6"
        >
          <Input placeholder="Full name" className="..." />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[{ required: true, message: "Enter your email" }]}
          className="mb-6"
        >
          <Input placeholder="Email" className="..." />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Enter your password" }]}
          className="mb-6"
        >
          <Input.Password placeholder="Password" className="..." />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          rules={[{ required: true, message: "Confirm your password" }]}
          className="mb-6"
        >
          <Input.Password placeholder="Confirm Password" className="..." />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
          className="w-full p-3 text-white font-semibold bg-[#1F5E29] rounded-md hover:bg-[#174a21] hover:shadow-lg"
          style={{ background: "#1F5E29", border: "none" }}
        >
          Create account
        </Button>
      </Form>

      <div className="mt-6 text-sm">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-[#1F5E29] font-semibold hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};
