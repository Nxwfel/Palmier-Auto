import React, { useState } from 'react'

const CarDetails = () => {
  const colors = [
    { name: 'Red', hex: '#EF4444' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Black', hex: '#111827' },
    { name: 'White', hex: '#F3F4F6' }
  ];
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const handleBuy = () => {
    // Placeholder: wire this up to real checkout or route
    alert(`Thank you — you've selected the car in ${selectedColor.name}. Proceeding to checkout...`);
  }

  return (
    <div
      className='h-screen w-screen flex justify-center items-center'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 absolute top-4 left-5 cursor-pointer">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      <div className='h-[70%] w-[80%] bg-white bg-opacity-60 backdrop-blur-md  flex p-8 gap-8 text-black shadow-2xl'>
        {/* Preview */}
        <div className='w-1/2 flex flex-col items-center justify-center gap-6'>
          <div
            className='h-[80%] w-full shadow-lg flex items-center justify-center'
            style={{ backgroundColor: selectedColor.hex }}
          >
            <span className={`text-2xl font-semibold ${selectedColor.name === 'White' ? 'text-white' : 'text-black'}`}>
              Car preview ({selectedColor.name})
            </span>
          </div>
          <p className='text-sm text-gray-300'>Preview updates when you pick a color.</p>
        </div>

        {/* Details & controls */}
        <div className='w-1/2 flex flex-col justify-center'>
          <h2 className='text-4xl font-semibold'>Palmier Auto — Model X</h2>
          <p className='mt-3 text-black'>Un véhicule moderne, fiable et entretenu par des spécialistes. Options disponibles et personnalisation selon vos besoins.</p>
          <p className='mt-6 text-2xl font-bold'>€29,999</p>

          <div className='mt-6'>
            <p className='text-sm text-black'>Choose color</p>
            <div className='flex gap-3 mt-3 items-center'>
              {colors.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  aria-label={`Select ${c.name}`}
                  className={`h-10 w-10 rounded-full border-2 focus:outline-none ${selectedColor.name === c.name ? 'ring-2 ring-white' : ''}`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              <div className='ml-4 text-sm'>Selected: <span className='font-medium'>{selectedColor.name}</span></div>
            </div>
          </div>

          <div className='mt-8'>
            <button onClick={handleBuy} className='px-6 py-3 bg-black text-white rounded-md font-medium'>Buy now</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetails