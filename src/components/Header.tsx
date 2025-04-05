import React from "react";
import { Avatar, Badge, Input } from "antd";
import {
  BellOutlined,
  MessageOutlined,
  MenuOutlined,
  SearchOutlined,
} from "@ant-design/icons";

interface HeaderProps {
  toggleSidebar: () => void;
  collapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, collapsed }) => {
  return (
    <header className="fixed top-0 left-0 w-full h-12 bg-white shadow-md flex items-center px-6 z-40">
      {/* Left Section: Sidebar Toggle */}
      <div
        className={`w-40 z-50 transition-all duration-100 ${
          collapsed ? "ml-20" : "ml-52"
        }`}
      >
        <button onClick={toggleSidebar} className="text-xl">
          <MenuOutlined className="cursor-pointer" />
        </button>
      </div>

      {/* Middle Section: Centered Search Bar */}
      <div className="flex-1 flex justify-center absolute left-1/2 transform -translate-x-1/2 w-full px-6">
        <div className="hidden md:block w-[600px]">
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined className="text-gray-500" />}
            className="w-full rounded-full"
            style={{
              borderRadius: "30px",
              border: "1px solid #ccc",
              boxShadow: "1px 1px 1px #ccc",
            }}
          />
        </div>
      </div>

      {/* Right Section: Notifications, Messages & User */}
      <div className="flex items-center gap-6 ml-auto">
        {/* Messages */}
        <Badge count={2} className="cursor-pointer">
          <MessageOutlined className="text-lg text-gray-600 hover:text-black transition" />
        </Badge>

        {/* Notifications */}
        <Badge count={3} className="cursor-pointer">
          <BellOutlined className="text-lg text-gray-600 hover:text-black transition" />
        </Badge>

        {/* User Info */}
        <div className="flex items-center gap-2">
          <Avatar src="https://i.pravatar.cc/300" />
          <span className="font-medium text-gray-700">Hi, Welcome</span>
        </div>
      </div>
    </header>
  );
};
