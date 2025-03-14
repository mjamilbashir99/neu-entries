"use client";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  // const session = useSession(); // Destructure session and status

  return (
    <div className="w-[90%] flex justify-between mx-auto text-white py-5 relative z-20">
      {/* left */}
      <div>
        <p className="text-xl">Entries</p>
      </div>

      {/* right */}
      <div className="flex gap-7">
        <div className="overflow-hidden group h-7">
          <p className="text-xl text-center group-hover:translate-y-[-100%] group-hover:duration-300 duration-300">
            Contact
          </p>
          <Link href="mailto:tmg.dev001@gmail.com">
            <p className="text-lg text-center text-gray-300  translate-y-[100%] group-hover:translate-y-[-100%] group-hover:duration-300 duration-300 group-hover:block">
              Contact
            </p>
          </Link>
        </div>
        <div className="overflow-hidden group h-7">
          <p className="text-xl text-center group-hover:translate-y-[-100%] group-hover:duration-300 duration-300">
            Get Started
          </p>
          <Link href="/login">
            <p className="text-lg text-center text-gray-300  translate-y-[100%] group-hover:translate-y-[-100%] group-hover:duration-300 duration-300 group-hover:block">
              Get Started
            </p>
          </Link>
        </div>
        <div className="overflow-hidden group h-7">
          <p className="text-xl text-center group-hover:translate-y-[-100%] group-hover:duration-300 duration-300">
            Journal
          </p>
          <Link href="/journal">
            <p className="text-lg text-center text-gray-300  translate-y-[100%] group-hover:translate-y-[-100%] group-hover:duration-300 duration-300 group-hover:block">
              Journal
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
