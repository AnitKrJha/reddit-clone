import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { theme } from "./../chakra/theme";
import Layout from "../components/Layout/Layout";
import { RecoilRoot } from "recoil";
import NextNProgress from 'nextjs-progressbar'
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <Layout>
            <NextNProgress/>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </RecoilRoot>
   
    </>
  );
}
