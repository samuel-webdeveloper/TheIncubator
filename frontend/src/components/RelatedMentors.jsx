import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedMentors = ({speciality, mentorId}) => {
    const {mentors} = useContext(AppContext)
    const navigate = useNavigate()

    const [relMentors, setRelMentors] = useState([])

    useEffect(()=>{
        if (mentors.length > 0 && speciality) {
            const mentorsData = mentors.filter((mentor)=> mentor.speciality === speciality && mentor._id !== mentorId)
            setRelMentors(mentorsData)
        }
    },[mentors,speciality,mentorId])

  return (
    <div id="available" className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
        <h1 className='text-3xl font-medium'>Related Mentors That You Can Also Book</h1>
        <p className='sm:w-1/3 text-center text-sm'>Browse through our extensive list of mentors and book an appointment</p>
        <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
            {relMentors.slice(0,5).map((item,index)=>(
                <div onClick={()=>{navigate(`/appointment/${item._id}`); scrollTo(0,0)}} className='border border-primary rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                    <img className='bg-blue-50' src={item.image} alt='Doctor image' />
                    <div className='p-4'>
                        <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                            <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                        </div>
                        <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                        <p className='text-gray-600 text-sm'>{item.speciality}</p>
                    </div>
                </div>
            ))}
        </div>
        <button onClick={()=>{navigate('/mentors'); scrollTo(0,0)}} className='bg-primary text-gray-600 px-12 py-3 rounded-full mt-10'>more</button>
    </div>
  )
}

export default RelatedMentors