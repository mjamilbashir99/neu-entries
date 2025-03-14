import React from "react";
import Navbar from "./Navbar";
import { Instrument_Serif } from "next/font/google";
import { Inter } from "next/font/google";
import ToggleStartBtn from "./ToggleStartBtn";
import Link from "next/link";
import Image from "next/image";

const instrumentSerif = Instrument_Serif({
  subsets: ["italic"],
  display: "swap",
  weight: "400",
});
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: "500",
});

const Banner = ({ img, title1, title2, title3, title4 }) => {
  return (
    <div
      style={{ backgroundImage: `url('${img}')` }}
      className="bg-cover bg-center relative rounded-xl"
    >
      {/* Overlay with lower z-index */}
      <div className="left-0 right-0 top-0 bottom-0 h-full bg-white absolute opacity-20 inset-0 z-10"></div>

      <Navbar />

      {/* Content with higher z-index */}
      <div className="w-2/6 mx-auto mt-12 z-20">
        <p className={`font-bold text-[60px] text-center ${inter.className}`}>
          {title1}
        </p>
        <p className={`text-[60px] text-center  ${instrumentSerif.className}`}>
          {title2}
        </p>
        <p className={`font-bold text-[60px] text-center  ${inter.className}`}>
          {title3} {/* Ensure inter font is applied here */}
        </p>
        <p className={`mt-10 text-[20px] text-center  ${inter.className}`}>
          {title4}
        </p>
      </div>

      <div className="flex justify-center">
        <Link href="/login">
          <ToggleStartBtn />
        </Link>
      </div>
      <div className="w-full flex justify-center items-center mt-10">
        <Image
          src={"/deeper.webp"}
          alt={"deeper"}
          className="w-4/6 rounded-xl"
          width={1000}
          height={600}
        />
      </div>
      <div className="blurr-effect"></div>
    </div>
  );
};

export default Banner;
