import Head from "next/head";
import React from "react";
import Navbar from "../Navbar.tsx/Navbar";

const Layout = ({ children }: any) => {
  return (
    <>
      <Head>
        <title>{"Reddit"}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" type="image/x-icon" href="/images/redditFace.svg" />
      </Head>
      <main>
        <Navbar />
        {children}
      </main>
    </>
  );
};

export default Layout;
