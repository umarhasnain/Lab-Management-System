// import React from 'react'

// const HeroSection = () => {
//   return (
// //     <div className="hero bg-base-200 min-h-screen">
// //   <div className="hero-content flex-col lg:flex-row-reverse">
// //     <img
// //       src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
// //       className="max-w-sm rounded-lg shadow-2xl" />
// //     <div>
// //       <h1 className="text-5xl font-bold">Box Office News!</h1>
// //       <p className="py-6">
// //         Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
// //         quasi. In deleniti eaque aut repudiandae et a id nisi.
// //       </p>
// //       <button className="btn btn-primary">Get Started</button>
// //     </div>
// //   </div>
// // </div>
// <div>
    
// </div>
//   )
// }

// export default HeroSection


'use client';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative bg-[#00b4d8] text-white min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16">
      {/* Left Content */}
      <div className="max-w-2xl text-center md:text-left">
        <motion.h1
          className="text-4xl md:text-6xl font-bold leading-tight"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Smart & Secure <br /> 
          <span className="text-[#90e0ef]">Laboratory Management</span>
        </motion.h1>
        <motion.p
          className="mt-4 text-lg opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Streamline lab operations with efficiency, security, and automation.
          Manage appointments, test reports, and analytics in one place.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-6 flex flex-col md:flex-row items-center md:items-start gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Button className="bg-white text-[#00b4d8] px-6 py-3 text-lg font-semibold rounded-lg shadow-lg hover:opacity-80">
            Get Started
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#00b4d8] px-6 py-3 text-lg font-semibold rounded-lg">
            Learn More
          </Button>
        </motion.div>
      </div>

      {/* Right Side: Hero Image */}
      <motion.div
        className="mt-10 md:mt-0"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Image
          src="/assets/images/hero2.png"
          alt="Lab Management System"
          width={1000}
          height={1000}
          className="w-full h-[400px] max-w-md md:max-w-lg"
        />
      </motion.div>
    </section>
  );
}
