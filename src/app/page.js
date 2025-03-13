'use client'


import HomePage from '@/components/FeautureSection'
import HeroSection from '@/components/HeroSection'
import Navbar from '@/components/Navbar'
import React from 'react'

const page = () => {
  return (
    <div>
<Navbar/>
      <HeroSection/>
      <HomePage/>
    </div>
  )
}

export default page
