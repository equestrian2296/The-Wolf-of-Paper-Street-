"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react"; // Arrow icon for button

const LandingPage = () => {
  const router = useRouter();
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const textTimer = setTimeout(() => setShowText(true), 3500);
    const buttonTimer = setTimeout(() => setShowButton(true), 3000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <div className="relative flex items-center justify-center h-screen 
                    bg-gradient-to-br from-gray-900 via-gray-800 to-black 
                    text-white overflow-hidden">
      
      {/* Animated Logo - Starts at Center then Moves Left */}
      <motion.div
        initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
        animate={{ scale: 1.2, opacity: 1, x: "-30%", y: "-50%" }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <Image src="/logo.png" alt="Wolf Logo" width={500} height={500} />
      </motion.div>

      {/* Glowing Modern Text */}
      {showText && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="absolute top-1/3 right-10 text-6xl font-extrabold 
                     text-white drop-shadow-[0_0_20px_rgba(0,153,255,0.8)]"
        >
          🐺 Happy Investing!
        </motion.div>
      )}

      {/* Stylish Login Button with Arrow */}
      {showButton && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          onClick={handleLoginClick}
          className="absolute bottom-10 right-10 flex items-center gap-3 
                     px-8 py-4 bg-blue-600 text-white font-semibold rounded-full 
                     shadow-xl hover:bg-blue-500 transition-all duration-300"
        >
          Login / Signup <ArrowRight size={24} />
        </motion.button>
      )}
    </div>
  );
};

export default LandingPage;
