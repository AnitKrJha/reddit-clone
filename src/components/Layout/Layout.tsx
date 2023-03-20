import React from "react";
import Navbar from "../Navbar.tsx/Navbar";

const Layout = ({ children }: any) => {
  return (
    <>
      <main>
        <Navbar />
        {children}
      </main>
    </>
  );
};

export default Layout;
