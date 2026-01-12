import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./Images/Shariki.png";
import img1 from "./Images/images.png";
import img2 from "./Images/diamond.png";
import img3 from "./Images/100.png";
import painter from "./Images/painter.png";
import diamond from "./Images/101.jfif";
import world from "./Images/pngtree-mount.jpg";
import webdesign from "./Images/mountains.jpg";
import aboutImg from "./Images/about.jpg";
import port1 from "./Images/portfolio-1.jpg";
import port2 from "./Images/portfolio-2.jpg";
import port3 from "./Images/portfolio-3.jpg";
import port4 from "./Images/102.png";
import port5 from "./Images/103.webp";
import port6 from "./Images/104.jpeg";
import port7 from "./Images/106.webp";
import port8 from "./Images/105.jpg";
import port9 from "./Images/107.jpg";
import port10 from "./Images/108.webp";
import port11 from "./Images/108.jpg";
import port12 from "./Images/109.webp";
import AboutUs from "./AboutUs";

function App() {
  return (
    <>
      <AboutUs
        logo={logo}
        img1={img1}
        img2={img2}
        img3={img3}
        painter={painter}
        diamond={diamond}
        world={world}
        webdesign={webdesign}
        aboutImg={aboutImg}
        port1={port1}
        port2={port2}
        port3={port3}
        port4={port4}
        port5={port5}
        port6={port6}
        port7={port7}
        port8={port8}
        port9={port9}
        port10={port10}
        port11={port11}
        port12={port12}
      />
      {/* <AboutUs/> */}
      
    </>
  );
}

export default App;
