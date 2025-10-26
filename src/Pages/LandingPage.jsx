import React from 'react'
import Header from '../Components/Header'
import Car from '../assets/Main-car.jpg'
import LogoLoop from '../Components/LogoLoop.jsx';
import Kia from '../assets/kia-logo.png'
import Toyota from '../assets/toyota-logo.png'
import Jetour from '../assets/jetour_logo.svg'
import Vw from '../assets/vw-logo.png'
import Geely from '../assets/geely-logo.png'
import Hyundai from '../assets/hyundai-logo.jpg'
const LandingPage = () => {
    const imageLogos = [
  { src: Kia, alt: "Company 1"},
  { src: Toyota, alt: "Company 2", href: "https://company2.com" },
  { src: Jetour, alt: "Company 3", href: "https://company3.com" },
  { src: Vw, alt: "Company 3", href: "https://company3.com" },
  { src: Geely, alt: "Company 3", href: "https://company3.com" },
  { src: Hyundai, alt: "Company 3", href: "https://company3.com" },
];
  return (
    <div className='h-screen rounded-b-[5vh] w-screen bg-[#fafafa] justify-start items-center flex flex-col'>
        <Header />
        <h1 className='font-main font-light absolute mt-[12vh] text-[5vw]'>Importer Avec <span className='text-emerald-700 font-thin'>Confiance</span></h1>
        <h1 className='absolute text-[34vh] tracking-wider flex mt-[24.5vh] text-emerald-900 opacity-30 italic uppercase font-main'>Palmier</h1>
        {/* Img slider */}
        <div className='h-[70vh] w-full mt-[9vh] flex justify-center items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor" className="size-[10vh] mr-auto cursor-pointer">
             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <img src={Car} alt="" className='absolute z-30  h-[70vh]'/>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor" className="size-[10vh] ml-auto cursor-pointer">
             <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
        </div>
        {/* Car infos */}
        <div className='h-[30vh] w-[70vw] flex flex-col justify-center text-center -mb-[5vh] ml-auto mr-auto'>
              <div style={{ height: '100px', position: 'relative', overflow: 'hidden'}}>
                <LogoLoop
                    logos={imageLogos}
                    speed={120}
                    direction="left"
                    logoHeight={48}
                    gap={40}
                    pauseOnHover
                    scaleOnHover
                    fadeOut
                    fadeOutColor="#ffffff"
                    ariaLabel="Technology partners"
                />
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor" className="size-[5vh] z-20 -mt-[5vh] cursor-pointer ml-auto mr-auto flex">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                </svg>
        </div>
    </div>
  )
}

export default LandingPage