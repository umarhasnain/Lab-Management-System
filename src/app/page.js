// 'use client';

// import { Button } from '@/components/ui/button';
// import { FaFlask, FaUserShield, FaClock, FaChartLine } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import { useState } from 'react';
// import { FiMenu, FiX } from 'react-icons/fi';

// export default function Home() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <div className="bg-[#00b4d8] text-white min-h-screen">
//       {/* Navbar */}
//       <nav className="bg-[#0077b6] p-5 fixed w-full top-0 shadow-lg z-50">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <h1 className="text-2xl font-bold">LabManage</h1>
//           <div className="hidden md:flex space-x-6">
//             <a href="#features" className="hover:opacity-80">Features</a>
//             <a href="#about" className="hover:opacity-80">About</a>
//             <a href="#contact" className="hover:opacity-80">Contact</a>
//           </div>
//           <Button className="hidden md:block bg-white text-[#00b4d8] px-4 py-2 rounded-lg">Get Started</Button>
//           <div className="md:hidden">
//             <button onClick={() => setMenuOpen(!menuOpen)}>
//               {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//             </button>
//           </div>
//         </div>
//         {menuOpen && (
//           <div className="md:hidden flex flex-col items-center bg-[#0077b6] py-4">
//             <a href="#features" className="py-2" onClick={() => setMenuOpen(false)}>Features</a>
//             <a href="#about" className="py-2" onClick={() => setMenuOpen(false)}>About</a>
//             <a href="#contact" className="py-2" onClick={() => setMenuOpen(false)}>Contact</a>
//           </div>
//         )}
//       </nav>

//       {/* Hero Section */}
//       <section className="flex flex-col items-center justify-center text-center py-28 px-5">
//         <motion.h1
//           className="text-5xl font-bold mb-4"
//           initial={{ opacity: 0, y: -50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//         >
//           Smart Laboratory Management
//         </motion.h1>
//         <p className="text-lg mb-6 max-w-2xl">
//           Simplify your lab operations with an efficient, secure, and automated management system.
//         </p>
//         <Button className="bg-white text-[#00b4d8] px-6 py-3 text-lg font-semibold rounded-lg shadow-lg hover:opacity-80">
//           Get Started
//         </Button>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="bg-white text-gray-900 py-16 px-5">
//         <h2 className="text-3xl font-bold text-center mb-12 text-[#00b4d8]">Key Features</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
//           {[{icon: FaFlask, title: 'Test Management', desc: 'Manage test samples efficiently.'},
//             {icon: FaUserShield, title: 'Data Security', desc: 'Advanced encryption & access control.'},
//             {icon: FaClock, title: '24/7 Access', desc: 'Monitor lab reports anytime.'},
//             {icon: FaChartLine, title: 'Analytics', desc: 'Powerful insights & reporting.'}
//           ].map((feature, index) => (
//             <motion.div
//               key={index}
//               className="p-6 border rounded-lg shadow-lg text-center bg-[#f0f9ff]"
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: index * 0.2 }}
//             >
//               <feature.icon className="text-[#00b4d8] text-5xl mb-4 mx-auto" />
//               <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
//               <p className="text-gray-600">{feature.desc}</p>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* Call to Action */}
//       <section id="contact" className="text-center py-16 bg-[#0077b6]">
//         <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Lab?</h2>
//         <p className="text-lg mb-6">Join us today and experience seamless laboratory management.</p>
//         <Button className="bg-white text-[#00b4d8] px-6 py-3 text-lg font-semibold rounded-lg shadow-lg hover:opacity-80">
//           Get Started
//         </Button>
//       </section>
//     </div>
//   );
// }



import HeroSection from '@/components/HeroSection'
import Navbar from '@/components/Navbar'
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
    </div>
  )
}

export default page
