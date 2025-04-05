import React from "react";
import { Breadcrumb } from "antd";
import { useDocumentTitle } from "@refinedev/react-router";

export const Home = () => {
  useDocumentTitle("Home | CIPMN CRM");
  return (
    <>
      <Breadcrumb
        style={{ fontSize: "12px", textAlign: "left" }}
        items={[
          {
            title: <a href="">Home</a>,
          },
          {
            title: "Dashboard",
          },
        ]}
      />

      <div className="flex items-center h-96 justify-center w-full">
        <h1 className="text-center text-3xl">Coming Soon!</h1>
      </div>
    </>
  );
};
