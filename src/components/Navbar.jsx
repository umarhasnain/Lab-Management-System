
'use client'

import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/">Tests</Link></li>
        <li><Link href="/">Appointments</Link></li>
        <li><Link href="/">Reports</Link></li>
      
        {/* <li>
          <a>Parent</a>
          <ul className="p-2">
            <li><a>Submenu 1</a></li>
            <li><a>Submenu 2</a></li>
          </ul>
        </li> */}
   
      </ul>
    </div>
    <h1 className="px-4 text-2xl font-[Noto Color Emoji]">
    <span className='text-primary'> InnoLab</span> Management 🧪🎯
    </h1>
   
  </div>
  <div className="navbar-center hidden lg:flex gap-4">
  <ul className="flex space-x-6 text-xl">
    <li>
      <Link href="/" className="hover:text-primary hover:border-b-2 transition-colors duration-300">
        Home
      </Link>
    </li>
    <li>
      <Link href="/" className="hover:text-primary hover:border-b-2 transition-colors duration-300">
        Tests
      </Link>
    </li>
    <li>
      <Link href="/" className="hover:text-primary hover:border-b-2 transition-colors duration-300">
        Appointments
      </Link>
    </li>
    <li>
      <Link href="/" className="hover:text-primary hover:border-b-2 transition-colors duration-300">
        Reports
      </Link>
    </li>

     {/* <li>
        <details>
          <summary>Parent</summary>
          <ul className="p-2">
            <li><a>Submenu 1</a></li>
            <li><a>Submenu 2</a></li>
          </ul>
        </details>
      </li> */}
  </ul>
</div>

  <div className="navbar-end ">
    <a className="btn">Register</a>
  </div>
</div>
    </div>
  )
}

export default Navbar
