import React, { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, Facebook, Instagram, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

const Footer = () => {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const response = await fetch('https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com/commercials/phone_numbers_wilayas')
      const data = await response.json()
      console.log('API Response:', data) // Debug log
      setLocations(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching locations:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <footer className='w-full bg-white py-8 border-t border-neutral-200'>
        <div className='max-w-7xl mx-auto px-8'>
          <div className='text-center text-neutral-600'>Chargement...</div>
        </div>
      </footer>
    )
  }

  return (
    <footer className='w-full bg-white font-main border-t border-neutral-200'>
      {/* Main Footer Content */}
      <div className='max-w-7xl mx-auto px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>

          {/* Follow Us */}
          <div>
            <h3 className='text-lg font-semibold text-black mb-4'>Suivez-nous</h3>
            <div className='flex gap-4 mb-4'>
              <motion.a
                href="https://www.facebook.com/profile.php?id=61574967869777"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className='w-10 h-10 rounded-full bg-neutral-100 hover:bg-amber-400 flex items-center justify-center text-neutral-700 hover:text-white transition-all duration-300'
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/palmier.auto"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className='w-10 h-10 rounded-full bg-neutral-100 hover:bg-amber-400 flex items-center justify-center text-neutral-700 hover:text-white transition-all duration-300'
              >
                <Instagram size={20} />
              </motion.a>
            </div>
            <div className='text-sm text-neutral-600 space-y-1'>
              <a href="mailto:Palmier.auto@gmail.com" className='hover:text-amber-400 transition-colors block'>
                Palmier.auto@gmail.com
              </a>
              <a href="tel:0773964196" className='hover:text-amber-400 transition-colors block'>
                0773 96 41 96
              </a>
            </div>
          </div>
        </div>

        {/* Locations Section */}
        <div className='mt-12 pt-8 border-t border-neutral-200'>
          <h3 className='text-xl font-semibold text-black mb-6'>Nos Locaux Commerciaux</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {locations.map((location, index) => (
              <motion.div
                key={location.id || location._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className='bg-neutral-50 rounded-lg p-5 hover:shadow-md transition-shadow duration-300'
              >
                <div className='flex items-start gap-3 mb-3'>
                  <div className='p-2 bg-amber-400/10 rounded-lg'>
                    <MapPin className='text-amber-400' size={20} />
                  </div>
                  <div>
                    <h4 className='font-semibold text-black'>
                      {location.name && location.surname 
                        ? `${location.name} ${location.surname}`
                        : location.nom || location.name || 'Local Commercial'}
                    </h4>
                    <span className='text-xs text-amber-400'>Local N°{index + 1}</span>
                  </div>
                </div>
                <div className='space-y-2 text-sm text-neutral-600'>
                  {/* Address - try multiple possible field names */}
                  {(location.address || location.adresse || location.wilayas) && (
                    <p className='flex items-start gap-2'>
                      <MapPin size={14} className='mt-1 flex-shrink-0' />
                      <span>
                        {location.address || location.adresse}
                        {location.wilayas && Array.isArray(location.wilayas) && (
                          <span className='block text-xs text-amber-500 mt-1'>
                            Wilayas: {location.wilayas.join(', ')}
                          </span>
                        )}
                      </span>
                    </p>
                  )}
                  
                  {/* Phone - try multiple possible field names */}
                  {(location.phone_number || location.telephone) && (
                    <p className='flex items-center gap-2'>
                      <Phone size={14} />
                      <a 
                        href={`tel:${location.phone_number || location.telephone}`}
                        className='hover:text-amber-400 transition-colors'
                      >
                        {location.phone_number || location.telephone}
                      </a>
                    </p>
                  )}
                  
                  {/* Working hours */}
                  <p className='flex items-center gap-2 text-xs'>
                    <Clock size={14} />
                    Dim-Sam: 9h00 - 18h00
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* No data message */}
          {locations.length === 0 && (
            <div className='text-center py-8 text-neutral-500'>
              Aucun local commercial disponible pour le moment.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='bg-neutral-50 border-t border-neutral-200'>
        <div className='max-w-7xl mx-auto px-8 py-4'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-600'>
            <p>© 2025 Palmier Auto. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer