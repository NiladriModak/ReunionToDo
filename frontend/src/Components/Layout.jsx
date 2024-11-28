import React from "react";
import Navbar from "./Navbar/Navbar";

function Layout({ children }) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full">
        <Navbar />
      </div>
      <div>{children}</div>
    </div>
  );
}

export default Layout;
