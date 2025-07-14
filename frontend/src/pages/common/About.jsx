import React from 'react'
import { assets } from '../../assets/assets'

const About = () => {
  return (
    <div className='m-6'>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.cover_1} alt='image'/>
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>We are a mentorship platform built to bridge the gap between aspiring talents and experienced professionals across diverse fields—from tech and design to business and creative industries. Our mission is simple: to help individuals unlock their full potential by learning directly from those who have walked the path before them.</p>
          <p>At TheIncubator, we believe in the power of connection, guidance, and growth. Whether you're looking to break into a new career, grow in your current role, or simply need support navigating life’s challenges, our network of dedicated mentors is here to help.</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>To build a world where no one walks their journey alone—where guidance, encouragement, and learning are always within reach.</p>
        </div>
      </div>
      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
      </div>
      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 md:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Connection</b>
          <p>Our mentors are relatable and experienced individuals who have walked the path you're on. They offer not just advice, but genuine support, encouragement, and practical insights tailored to your journey.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 md:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Flexibility</b>
          <p>We respect your time. Whether you prefer a quick chat or an in-depth session, you can book free or VIP appointments that fit your schedule—anytime, anywhere.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 md:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Diversity</b>
          <p>With mentors across fields like tech, design, writing, and business, you are sure to find someone who understands your goals and can guide you with relevance and empathy.</p>
        </div>
      </div>
    </div>
  )
}

export default About