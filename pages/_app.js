import "../styles/globals.css";
import { useEffect, useState } from "react";
import { Montserrat_Alternates } from "next/font/google";
import axios from "axios";
import Head from "next/head";



const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["400"],
});


function MyApp({ Component, pageProps }) {

  const [isTextareaClicked, setIsTextareaClicked] = useState(false);

  const [show, setShow] = useState(false);
 

  return (
    <main
      className={`${
        montserratAlternates.className
      } h-screen flex flex-col background-transition ${
        isTextareaClicked ? "withoutBg" : "bodyBg"
      }`}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <Head>
      <title>Anky</title>
      <meta name="description" content="Anky helps you overcome writer's block by providing a streamlined, distraction-free writing environment." />
      <link rel="icon" href="/favicon.ico" />
      
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Anky - Unleash Your Creativity" />
      <meta property="og:description" content="Anky helps you overcome writer's block by providing a streamlined, distraction-free writing environment." />
      <meta property="og:image" content="https://anky.degen/images/librarian.png" />
      <meta property="og:url" content="https://anky.degen" />
      <meta property="og:site_name" content="Anky" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@anky" />
      <meta name="twitter:title" content="Anky - Unleash Your Creativity" />
      <meta name="twitter:description" content="Overcome writer's block with Anky's distraction-free writing platform." />
      <meta name="twitter:image" content="https://anky.degen/images/librarian.png" />
      <meta name="twitter:url" content="https://anky.degen" />
      </Head>
        <Component
          {...pageProps}
          isTextareaClicked={isTextareaClicked}
          setIsTextareaClicked={setIsTextareaClicked}
          show={show}
        />
    </main>
  );
}

export default MyApp;
