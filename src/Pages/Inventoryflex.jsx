import React from 'react'
const Inventoryflex = () => {
  return (
     <div
    className='h-screen w-screen bg-neutral-300 justify-start items-start flex flex-col'>
    <h1 className='font-main font-thin text-[5vw] text-white pt-[10vh]'>Notre Voiture <span className='text-neutral-600'>Importé</span></h1>
    <div className='flex h-fit w-screen justify-start items-start mt-[5vh]'>

       <ul className='font-main text-neutral-500 font-thin text-lg mt-[2vh] ml-[1vw]'>
        <li>Chinois</li>
        <li>Canadienes</li>
        <li>Europeanes</li>
        <li>Pays du Golf</li>
       </ul>
       {/* Img Slider */}
     <div className='h-fit flex flex-col overflow-x-scroll max-w-[80vw] ml-auto '>
      <div className='flex h-[45vh] gap-[2vw]'>
      <div className='h-full min-w-[23vw]'>
        <div className='h-[80%] w-full bg-white'>

        </div>
        <h1 className='font-main text-[2vh] text-black'>Kia Sportage 2025</h1>
        <p className='font-main font-thins text-[1.7vh] text-neutral-400'>1.6 CRDI qui devlop 167ps et une boite de 7 rapports et LED d'ambiance à l'interieur</p>

      </div>
      <div className='h-full min-w-[23vw]'>
        <div className='h-[80%] w-full bg-white'>

        </div>
        <h1 className='font-main text-[2vh] text-black'>Kia Sportage 2025</h1>
        <p className='font-main font-thins text-[1.7vh] text-neutral-400'>1.6 CRDI qui devlop 167ps et une boite de 7 rapports et LED d'ambiance à l'interieur</p>

      </div>
      <div className='h-full min-w-[23vw]'>
        <div className='h-[80%] w-full bg-white'>

        </div>
        <h1 className='font-main text-[2vh] text-black'>Kia Sportage 2025</h1>
        <p className='font-main font-thins text-[1.7vh] text-neutral-400'>1.6 CRDI qui devlop 167ps et une boite de 7 rapports et LED d'ambiance à l'interieur</p>

      </div>
      <div className='h-full min-w-[23vw]'>
        <div className='h-[80%] w-full bg-white'>

        </div>
        <h1 className='font-main text-[2vh] text-black'>Kia Sportage 2025</h1>
        <p className='font-main font-thins text-[1.7vh] text-neutral-400'>1.6 CRDI qui devlop 167ps et une boite de 7 rapports et LED d'ambiance à l'interieur</p>

      </div>
      <div className='h-full min-w-[23vw]'>
        <div className='h-[80%] w-full bg-white'>

        </div>
        <h1 className='font-main text-[2vh] text-black'>Kia Sportage 2025</h1>
        <p className='font-main font-thins text-[1.7vh] text-neutral-400'>1.6 CRDI qui devlop 167ps et une boite de 7 rapports et LED d'ambiance à l'interieur</p>

      </div>
      </div>
     </div>
    </div>
      {/* Navigation Arrows */}
      <div className='flex w-[80%] h-fit ml-auto items-center justify-between mt-[2vh]'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </div>
  )
}

export default Inventoryflex