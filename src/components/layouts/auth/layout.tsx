import React from "react";
import { Outlet } from "react-router-dom";

export const Layout: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row w-full bg-white shadow-lg overflow-hidden">
        {/* Left Column (Image & Quote) */}
        <div
          className="hidden md:flex md:w-1/2 h-screen bg-[#1F5E29] flex-col items-center justify-center p-8  bg-cover bg-center"
          style={{
            backgroundImage: "url('/assets/img/10008082.jpg')",
          }}
        >
          {/* Image Containers */}
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg p-4">
              <img
                src="/assets/logos/COAT_OF_ARM.jpeg"
                alt="Tech"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg p-4">
              <img
                src="/assets/logos/CIPMN.jpeg"
                alt="Innovation"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Quote */}
          <div className="w-1/2 text-center text-white mt-12">
            <span className="text-3xl font-bold">“</span>
            <p className="text-sm leading-relaxed font-semibold">
              Technology is the bridge between imagination and reality,
              transforming ideas into innovation and shaping the future with
              every breakthrough.
            </p>
            <span className="text-3xl font-bold">”</span>
          </div>
        </div>

        {/* Right Column (Authentication Form) */}
        <div className="w-full md:w-1/2 h-screen flex flex-col items-center justify-center p-12">
          <Outlet /> {/* Renders Login or Register Page */}
        </div>
      </div>
    </div>
  );
};
