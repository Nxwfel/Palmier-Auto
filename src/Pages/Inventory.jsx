import React , {useState} from 'react'
import {motion} from 'framer-motion'
const Inventory = () => {
    const [totalres , setTotalres] = useState("0")
  return (
    <div className='min-h-screen w-screen flex flex-col px-[3vw] py-[2vh]'>

        <div className='z-20  h-[10vh] w-full flex justify-between  items-center '>
            <motion.h1 
            initial={{scale:1}}
            whileHover={{scale:1.02}}
            whileTap={{scale:1}}
            className='font-main cursor-pointer font-thin text-[2vw] max-md:text-[5vw]'>Palmier Auto</motion.h1>
        </div>
        <div className='h-[10vh] w-full flex justify-between items-center gap-[2vw]'>
           <motion.div
           initial={{scale:1}}
           whileHover={{scale:1.05}}
           className='flex justify-center items-center cursor-pointer h-fit w-fit p-2 rounded-full shadow-xl gap-[.5vw]'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            <p className='font-main'>
                Filtrer
            </p>
           </motion.div>
           <p className='font-main pr-[3vw]'>Résultat: {totalres}</p>
        </div>
        <div className='h-[80%] w-full gap-[10vh] grid grid-cols-4 max-md:grid-cols-1'>
          <motion.div
          initial={{scale:1}}
          whileHover={{scale:1.06}}
          whileTap={{scale:1}}
          className='h-[49vh] w-[18vw] cursor-pointer max-md:w-[50vw]  max-md:ml-auto max-md:mr-auto flex flex-col bg-white shadow-lg '>
             <div className='h-[77%] w-[full] bg-neutral-600 '>

             </div>
             <h1 className='font-main text-[1.4vw] max-md:text-[5vw] text-black px-2'>Kia Sportage</h1>
             <h1 className='font-main font-extralight max-md:text-[3vw] text-[1.4vw] text-black px-2'>250 Millions</h1>
          </motion.div>
        </div>

    </div>
  )
}

export default Inventory