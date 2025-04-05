import React, { useState } from "react";
import { Layout } from "antd";
import { Sidebar } from "../../Sidebar";
import { Outlet } from "react-router-dom";
import { Header } from "../../Header";
import { useDocumentTitle } from "@refinedev/react-router";

const { Content } = Layout;

export const HomeLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  useDocumentTitle("Home | CIPMN CRM");

  return (
    <Layout className="min-h-screen">
      {/* Fixed Header */}
      <Header
        toggleSidebar={() => setCollapsed(!collapsed)}
        collapsed={collapsed}
      />

      {/* Sidebar that overlaps the header */}
      <Sidebar collapsed={collapsed} />

      <Layout
        className={`transition-all duration-100 ${
          collapsed ? "ml-20" : "ml-52"
        }`}
      >
        <Content className="p-6 bg-white mt-8">
          <Outlet /> {/* Renders Dashboard Content */}
        </Content>
      </Layout>
    </Layout>
  );
};
