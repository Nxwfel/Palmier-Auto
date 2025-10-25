import React from 'react'
import Header from '../Components/Header'
import Car from '../assets/Main-car.jpg'
const LandingPage = () => {
  return (
    <div className='h-screen w-screen bg-[#fafafa] justify-start items-center flex flex-col'>
        <Header />
        <h1 className='absolute text-[34vh] tracking-wider flex mt-[24.5vh] text-emerald-900 opacity-30 italic uppercase font-main'>Palmier</h1>
        {/* Img slider */}
        <div className='h-[70vh] w-full mt-[9vh] flex justify-center items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[10vh] mr-auto cursor-pointer">
             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <img src={Car} alt="" className='absolute z-30  h-[70vh]'/>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[10vh] ml-auto cursor-pointer">
             <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
        </div>
        {/* Car infos */}
        <div className='h-[30vh] w-[40vw] flex flex-col mt-auto mb-[2vh] ml-[8vw] mr-auto '>
           <h1 className='font-main text-black text-[4vh]'>Kia Sportage 2025</h1>
           <p className='font-main text-emerald-900 opacity-30'>Compact-crossover SUVs are popular for their combination of versatility and space along with a modicum of style, but performance is not a priority.</p>
           <div class="flex items-center justify-center -ml-[25vw] mt-[1vh]">
            <div class="relative group">
                <button
                class="relative inline-block p-px font-semibold leading-6 text-black bg-white shadow-2xl cursor-pointer rounded-2xl shadow-emerald-900 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-emerald-600"
                >
                <span
                    class="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-600 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                ></span>
                <span class="relative z-10 block px-6 py-3 rounded-2xl bg-white">
                    <div class="relative z-10 flex items-center space-x-3">
                    <span
                        class="transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-emerald-300"
                        >Commandez!</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-7 h-7 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-emerald-300"
                    >
                        <path
                        d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                        ></path>
                    </svg>
                    </div>
                </span>
                </button>
            </div>
            </div>
        </div>
    </div>
  )
}

export default LandingPage