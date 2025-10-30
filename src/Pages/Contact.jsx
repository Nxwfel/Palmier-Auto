import React, { useState } from 'react'
import Map from '../assets/map.jpeg'
const Contact = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: replace alert with real submit (API call)
    alert(`Merci ${name || 'client'}! Nous avons reçu votre message.`)
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div className='h-screen w-screen bg-white flex flex-col justify-end items-start'>
      <div className='absolute shadow-xl mb-[25vh] ml-[5vw] h-[70vh] w-[25vw] bg-white rounded-lg z-20 p-6 overflow-y-auto'>
  <h3 className='text-2xl font-semibold text-black'>Palmier Auto</h3>
  <p className='text-sm text-neutral-500 mt-1 mb-4'>Votre concessionnaire automobile de confiance</p>
  
  {/* Dealership Contact */}
  <div className='mb-6'>
    <h4 className='font-semibold mb-2 text-emerald-700'>Siège Social</h4>
    <div className='space-y-2 text-sm'>
      <p><span className='font-medium'>Adresse:</span><br/>123 Boulevard de l'Automobile<br/>75001 Paris, France</p>
      <p><span className='font-medium'>Téléphone:</span><br/>+33 1 23 45 67 89</p>
      <p><span className='font-medium'>Email:</span><br/>contact@palmier-auto.fr</p>
      <p><span className='font-medium'>Horaires:</span><br/>Lun-Ven: 9h-19h<br/>Sam: 9h-17h</p>
    </div>
  </div>
  
  {/* Commercial Points */}
  <div className='mb-6'>
    <h4 className='font-semibold mb-2 text-emerald-700'>Points de Vente</h4>
    <div className='space-y-4'>
      <div className='text-sm'>
        <p className='font-medium'>Paris Nord</p>
        <p>45 Rue du Commerce, 95000 Cergy</p>
        <p>Tél: +33 1 98 76 54 32</p>
      </div>
      <div className='text-sm'>
        <p className='font-medium'>Paris Sud</p>
        <p>78 Avenue des Voitures, 91300 Massy</p>
        <p>Tél: +33 1 45 67 89 01</p>
      </div>
    </div>
  </div>
  
  {/* Contact Form */}
  <div>
    <h4 className='font-semibold mb-2 text-emerald-700'>Envoyez-nous un message</h4>
    <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Votre nom' className='px-3 py-2 rounded border border-neutral-200 bg-neutral-50' />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Votre email' type='email' className='px-3 py-2 rounded border border-neutral-200 bg-neutral-50' />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Votre message' rows={3} className='px-3 py-2 rounded border border-neutral-200 bg-neutral-50' />
      <button type='submit' className='mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors'>
        Envoyer
      </button>
    </form>
  </div>
</div>
      <div 
            style={{backgroundImage:`url(${Map})` , backgroundPosition:'center'}}
      className='h-[55vh] w-screen justify-center items-center bg-black/20'>
        
      </div>
      <div className='w-screen h-fit flex justify-between items-center py-5 px-5'>
        <div className='h-full flex flex-col justify-start items-start '>
            <h1 className='font-main text-[4vh] text-black'>Palmier-Auto</h1>
            <p className='font-main text-[1vh] text-neutral-400 max-w-[20vw]'>
             Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum eum sequi impedit, inventore architecto consequuntur consequatur a nobis ipsa at, quaerat numquam dolore nulla dolorum! Eius ea tempore odio molestiae.
            </p>
        </div>
        <div className='h-full flex gap-[2vw] mt-[7vh] mr-[7vw] font-main'>
           <p>Facebook</p>
           <p>Instagram</p>
           <p>Whatsapp</p>
           <p>Telegram</p>
        </div>
        <div className='h-full flex flex-col mt-[3vh] p-4 font-main'>
            <p>Copyrights 2025 c</p>
        </div>
      </div>
    </div>
  )
}

export default Contact