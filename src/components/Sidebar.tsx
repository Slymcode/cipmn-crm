import React, { useEffect } from "react";
import { Layout, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { DashboardOutlined, LogoutOutlined } from "@ant-design/icons";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate(); // For navigation after logout

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("access_token"); // Remove stored token (modify as needed)
    sessionStorage.removeItem("user"); // Remove session data if used
    localStorage.removeItem("GUSER"); // Remove guest user data if used

    // Redirect to login page
    navigate("/login?logged_out=true");
  };

  console.log(
    "Sidebar rendered with collapsed state:",
    localStorage.getItem("GUSER")
  );
  const guser = localStorage.getItem("GUSER");
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined style={{ color: "white" }} />,
      label: (
        <Link to="/" style={{ color: "white" }}>
          Dashboard
        </Link>
      ),
    },
    // Only add this if GUSER is NOT found
    ...(!guser
      ? [
          {
            key: "membership",
            icon: <DashboardOutlined style={{ color: "white" }} />,
            label: (
              <Link to="/membership" style={{ color: "white" }}>
                Membership
              </Link>
            ),
          },
        ]
      : []),
    {
      key: "logout",
      icon: <LogoutOutlined style={{ color: "white" }} />,
      label: <span style={{ color: "white" }}>Logout</span>,
      onClick: handleLogout,
    },
  ];

  // use useEffect and redirect user to profile if localStorage.getItem("GUSER")
  useEffect(() => {
    if (guser) {
      navigate("/profile");
    }
  }, [guser, navigate]);

  return (
    <div className="fixed left-0 top-0 h-screen text-white z-50">
      <Sider
        collapsible
        collapsed={collapsed}
        width={208}
        style={{ backgroundColor: "#1F5E29" }} // Sidebar background
      >
        {/* Fixed Brand Section */}
        <div
          className="h-20 flex items-center gap-x-2 justify-center text-lg font-bold border-b border-gray-600"
          style={{ backgroundColor: "#14401D", color: "white" }}
        >
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg p-1">
            <img
              src="/assets/logos/CIPMN.jpeg"
              alt="Innovation"
              className="w-full h-full object-cover"
            />{" "}
          </div>{" "}
          {collapsed ? "" : <span className="text-2xl font-bold ">CIPMN</span>}
        </div>

        {/* Scrollable Menu Section */}
        <div
          className="overflow-y-auto"
          style={{ height: "calc(100vh - 4rem)", backgroundColor: "#1F5E29" }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={["dashboard"]}
            theme="dark"
            style={{ backgroundColor: "#1F5E29", color: "white" }}
            items={menuItems}
          />
        </div>
      </Sider>

      {/* Custom Styles for Hover & Active State */}
      <style>
        {`
          .ant-menu-dark .ant-menu-item-selected {
            background-color: #14401D !important; /* Active menu item */
          }
          .ant-menu-dark .ant-menu-item:hover {
            background-color: #267A3E !important; /* Hover effect */
          }
        `}
      </style>
    </div>
  );
};
